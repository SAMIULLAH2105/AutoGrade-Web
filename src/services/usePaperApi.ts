import { useCallback, useEffect, useRef } from "react";
import { endpoints } from "@/services/endpoints";
import type {
  BatchPaperResult,
  ExtractTextApiResponse,
  EvaluateAnswerApiRequest,
  EvaluateAnswerApiResponse,
  HistoryApiResponse,
  BackendHistoryEntry,
  HistoryItem,
} from "@/types/api";
import { useAppData, useAuth } from "@/state/AppContext";
import JSZip from "jszip";

async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }
  return (await res.json()) as T;
}

async function fetchJsonOrThrow<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  const text = await res.text().catch(() => "");

  if (!res.ok) {
    throw new Error(text || `Request failed (${res.status})`);
  }

  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("Invalid JSON response");
  }
}

function authHeader(token?: string): HeadersInit {
  return token ? { Authorization: `Token ${token}` } : {};
}

function backendHistoryToUiItem(entry: BackendHistoryEntry, userId: string): HistoryItem {
  const fileLabel =
    entry.paper_id ||
    [entry.paper_code, entry.paper_number].filter(Boolean).join("/") ||
    entry.question_id ||
    "Paper";

  const stableId = `${fileLabel}-${entry.question_id ?? "q"}-${entry.created_at}`;

  return {
    id: stableId,
    created_at: entry.created_at,
    user_id: userId,
    file_names: [fileLabel],
    evaluation: entry.evaluation_text,
    paper_id: entry.paper_id,
    paper_code: entry.paper_code,
    paper_number: entry.paper_number,
    question_id: entry.question_id,
    raw: entry,
  };
}

async function listZipPaperFiles(zipFile: File): Promise<string[]> {
  const zip = await JSZip.loadAsync(zipFile);
  const names = Object.keys(zip.files)
    .filter((name) => !zip.files[name]?.dir)
    .filter((name) => /\.(pdf|png|jpe?g)$/i.test(name))
    .map((name) => name.split("/").pop() || name)
    .filter(Boolean);

  // Keep stable ordering for UI.
  names.sort((a, b) => a.localeCompare(b));
  return names;
}

export function usePaperApi() {
  const { user } = useAuth();
  const { setLatestResult, addHistory, history, setHistory } = useAppData();

  const historyRef = useRef(history);
  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  const evaluateAnswer = useCallback(
    async (payload: EvaluateAnswerApiRequest): Promise<EvaluateAnswerApiResponse> => {
      const token = user?.token;
      return await fetchJsonOrThrow<EvaluateAnswerApiResponse>(endpoints.evaluateAnswer, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(token),
        },
        body: JSON.stringify(payload),
      });
    },
    [user?.token]
  );

  const extractText = useCallback(
    async (
      files: File[],
      options: {
        paper_id?: string;
        paper_code?: string;
        paper_number?: string;
      } = {}
    ): Promise<HistoryItem> => {
      if (!user) throw new Error("Not authenticated");
      if (!files.length) throw new Error("No files provided");

      const token = user.token;

      // Backend contract: single `file` field per request.
      const parts: Array<{
        fileName: string;
        extracted: string;
        questionText?: string;
        extractionMessage?: string;
      }> = [];

      let resolvedQuestionText: string | undefined;
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const r = await fetchJson<ExtractTextApiResponse>(endpoints.extractText, {
          method: "POST",
          headers: authHeader(token),
          body: formData,
        });

        if (!r.success) {
          throw new Error(r.message || "Text extraction failed");
        }

        if (!resolvedQuestionText && r.question_text?.trim()) {
          resolvedQuestionText = r.question_text.trim();
        }

        parts.push({
          fileName: file.name,
          extracted: r.extracted_text,
          questionText: r.question_text,
          extractionMessage: r.message,
        });
      }

      const combinedExtractedText =
        parts.length === 1
          ? parts[0]!.extracted
          : parts.map((p) => `=== ${p.fileName} ===\n${p.extracted}`).join("\n\n");

      if (!resolvedQuestionText) {
        throw new Error(
          "Backend did not provide question_text from /api/extract-text/. Please update backend to include it."
        );
      }

      const evaluationResponse = await evaluateAnswer({
        question_text: resolvedQuestionText,
        student_answer: combinedExtractedText,
        paper_id: options.paper_id,
        paper_code: options.paper_code,
        paper_number: options.paper_number,
      });

      if (!evaluationResponse.success) {
        throw new Error(evaluationResponse.message || "Evaluation failed");
      }

      const item: HistoryItem = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        user_id: user.id,
        file_names: files.map((f) => f.name),
        evaluation: evaluationResponse.evaluation,
        message:
          evaluationResponse.message ||
          parts.map((p) => p.extractionMessage).find(Boolean) ||
          "Evaluation completed successfully.",
        paper_id: options.paper_id,
        paper_code: options.paper_code,
        paper_number: options.paper_number,
        question_id: evaluationResponse.question_id,
        raw: { extractionParts: parts, evaluation: evaluationResponse },
      };

      setLatestResult(item);
      addHistory(item);

      return item;
    },
    [addHistory, evaluateAnswer, setLatestResult, user]
  );

  const getHistory = useCallback(async (): Promise<HistoryItem[]> => {
    if (!user) throw new Error("Not authenticated");

    const token = user.token;

    if (!token) throw new Error("Missing auth token");

    const response = await fetchJson<HistoryApiResponse>(endpoints.history, {
      method: "GET",
      headers: authHeader(token),
    });
    if (!response.success) {
      throw new Error(response.message || "Failed to load history");
    }

    const mapped = response.history.map((h) => backendHistoryToUiItem(h, user.id));
    setHistory(mapped);
    return mapped;
  }, [setHistory, user]);

  const extractBatchZip = useCallback(
    async ({ zipFile, title }: { zipFile: File; title: string }): Promise<HistoryItem> => {
      if (!user) throw new Error("Not authenticated");
      if (user.role !== "teacher") throw new Error("Teacher access required");
      if (!title.trim()) throw new Error("Title is required");

      const fileNames = await listZipPaperFiles(zipFile);
      if (fileNames.length === 0) {
        throw new Error("No supported papers found in zip (pdf/png/jpg)");
      }

      // Live mode: no backend endpoint is defined in apis.md for batch zip uploads yet.
      throw new Error("Batch zip processing is not wired to the backend yet.");
    },
    [addHistory, setLatestResult, user]
  );

  return { extractText, extractBatchZip, getHistory, demoMode: false };
}
