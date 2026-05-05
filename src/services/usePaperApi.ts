import { useCallback, useEffect, useRef } from "react";
import { endpoints } from "@/services/endpoints";
import type {
  BatchPaperResult,
  ExtractTextApiResponse,
  ExtractTextResultItem,
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

function formatExtractEvaluation(result: ExtractTextResultItem): string {
  const evaluation = result.evaluation;
  if (!evaluation) return "";

  const lines: string[] = [];
  lines.push(`Total Score: ${evaluation.total_score}`);

  for (const q of evaluation.questions ?? []) {
    lines.push("");
    lines.push(`Question ID: ${q.question_id}`);
    if (q.question_text?.trim()) lines.push(`Question: ${q.question_text.trim()}`);
    if (q.score?.trim()) lines.push(`Score: ${q.score.trim()}`);
    if (q.comments?.trim()) lines.push(q.comments.trim());
  }

  return lines.join("\n").trim();
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

  const extractText = useCallback(
    async (
      files: File[],
      options: {
        subject?: "isl" | "chem" | "math" | "physics";
        question_text?: string;
        evaluate?: boolean;
        paper_id?: string;
        paper_code?: string;
        paper_number?: string;
      } = {}
    ): Promise<HistoryItem> => {
      if (!user) throw new Error("Not authenticated");
      if (!files.length) throw new Error("No files provided");
      if (!options.subject) throw new Error("Subject is required");

      const token = user.token;

      // Backend supports multiple files in one request: request.FILES.getlist('file')
      const formData = new FormData();
      for (const file of files) {
        formData.append("file", file);
      }
      formData.append("subject", options.subject);
      if (typeof options.evaluate === "boolean") {
        // server accepts boolean/string; send string to be explicit in multipart
        formData.append("evaluate", options.evaluate ? "true" : "false");
      }
      if (options.question_text?.trim()) {
        formData.append("question_text", options.question_text.trim());
      }
      if (options.paper_id?.trim()) formData.append("paper_id", options.paper_id.trim());
      if (options.paper_code?.trim()) formData.append("paper_code", options.paper_code.trim());
      if (options.paper_number?.trim()) formData.append("paper_number", options.paper_number.trim());

      const r = await fetchJson<ExtractTextApiResponse>(endpoints.extractText, {
        method: "POST",
        headers: authHeader(token),
        body: formData,
      });

      if (!r.success) {
        throw new Error(r.message || "Text extraction failed");
      }

      const results = r.results ?? [];
      if (results.length === 0) throw new Error("No results returned from extract-text API");

      const combinedEvaluationText =
        results.length === 1
          ? formatExtractEvaluation(results[0]!)
          : results
              .map((res) => `=== ${res.file_name} ===\n${formatExtractEvaluation(res)}`)
              .join("\n\n");

      const responseMessage =
        r.message || results.map((res) => res.evaluation?.message).find(Boolean) || undefined;

      const item: HistoryItem = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        user_id: user.id,
        file_names: results.map((res) => res.file_name) || files.map((f) => f.name),
        evaluation: combinedEvaluationText,
        message: responseMessage || "Files processed successfully.",
        paper_id: options.paper_id,
        paper_code: options.paper_code,
        paper_number: options.paper_number,
        raw: r,
      };

      setLatestResult(item);
      addHistory(item);

      return item;
    },
    [addHistory, setLatestResult, user]
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
