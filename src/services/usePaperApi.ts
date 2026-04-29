import { useCallback, useEffect, useRef } from "react";
import { endpoints, DEMO_MODE } from "@/services/endpoints";
import type {
  BatchPaperResult,
  ExtractTextApiResponse,
  HistoryApiResponse,
  HistoryItem,
} from "@/types/api";
import { useAppData, useAuth } from "@/state/AppContext";
import JSZip from "jszip";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }
  return (await res.json()) as T;
}

function makeDemoExtractResponse(): ExtractTextApiResponse {
  return {
    success: true,
    extracted_text: {
      success: true,
      evaluation:
        "Score: 4/10 marks\n\nSuggestions for Improvement:\n- Elaborate on the \"detailed account\" of Zakat: Include nisab/haul, types of wealth, rates, recipients, and historical context.\n- Add more specific spiritual benefits: earning Allah's forgiveness and fulfilling a Pillar of Islam.\n- Add more specific social benefits: balancing the economy and promoting societal peace.",
      message: "Evaluation completed successfully.",
    },
    message: "Text extracted successfully.",
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

  const extractText = useCallback(
    async (files: File[]): Promise<HistoryItem> => {
      if (!user) throw new Error("Not authenticated");
      if (!files.length) throw new Error("No files provided");

      const formData = new FormData();
      files.forEach((file) => formData.append("file", file));

      let response: ExtractTextApiResponse;
      if (DEMO_MODE) {
        await sleep(350);
        response = makeDemoExtractResponse();
      } else {
        response = await fetchJson<ExtractTextApiResponse>(endpoints.extractText, {
          method: "POST",
          body: formData,
        });
      }

      if (!response.success || !response.extracted_text?.success) {
        throw new Error(
          response.message || response.extracted_text?.message || "Processing failed"
        );
      }

      const item: HistoryItem = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        user_id: user.id,
        file_names: files.map((f) => f.name),
        evaluation: response.extracted_text.evaluation,
        message: response.extracted_text.message || response.message,
        raw: response,
      };

      setLatestResult(item);
      addHistory(item);

      return item;
    },
    [addHistory, setLatestResult, user]
  );

  const getHistory = useCallback(async (): Promise<HistoryItem[]> => {
    if (!user) throw new Error("Not authenticated");

    if (DEMO_MODE) {
      return historyRef.current.filter((h) => h.user_id === user.id);
    }

    const response = await fetchJson<HistoryApiResponse>(endpoints.userHistory(user.id));
    if (!response.success) {
      throw new Error(response.message || "Failed to load history");
    }

    setHistory(response.history);
    return response.history;
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

      if (DEMO_MODE) {
        await sleep(400);

        const paperResults: BatchPaperResult[] = fileNames.map((name, idx) => ({
          id: crypto.randomUUID(),
          file_name: name,
          evaluation:
            `Score: 4/10 marks\n\nSuggestions for Improvement:\n- Demo evaluation for ${name}.\n- Replace this with the backend response per paper.\n- You can edit this in “Edit Results”. (Paper #${idx + 1})`,
          message: "Evaluation completed successfully.",
        }));

        const item: HistoryItem = {
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          user_id: user.id,
          title: title.trim(),
          file_names: fileNames,
          evaluation: "Batch processed (demo).",
          paper_results: paperResults,
          is_finalized: false,
          message: "Batch evaluation completed successfully.",
          raw: { demo_mode: true, zip_file_name: zipFile.name },
        };

        setLatestResult(item);
        addHistory(item);
        return item;
      }

      // Live mode placeholder: wire to your backend when ready.
      const formData = new FormData();
      formData.append("file", zipFile);
      formData.append("title", title.trim());
      const response = await fetchJson<ExtractTextApiResponse>(endpoints.extractText, {
        method: "POST",
        body: formData,
      });
      if (!response.success || !response.extracted_text?.success) {
        throw new Error(
          response.message || response.extracted_text?.message || "Processing failed"
        );
      }

      const item: HistoryItem = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        user_id: user.id,
        title: title.trim(),
        file_names: fileNames,
        evaluation: response.extracted_text.evaluation,
        message: response.extracted_text.message || response.message,
        raw: response,
      };

      setLatestResult(item);
      addHistory(item);
      return item;
    },
    [addHistory, setLatestResult, user]
  );

  return { extractText, extractBatchZip, getHistory, demoMode: DEMO_MODE };
}
