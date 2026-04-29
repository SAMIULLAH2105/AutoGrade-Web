import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppData } from "@/state/AppContext";
import { toast } from "@/hooks/use-toast";
import { downloadBatchResultsPdf } from "@/services/pdf";
import { DoodleBackground } from "@/components/decor/DoodleBackground";
import { Badge } from "@/components/ui/badge";

export default function TeacherEditResultsPage() {
  const { history, updateHistoryItem } = useAppData();
  const items = useMemo(
    () => [...history].sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [history]
  );

  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null);
  const selected = items.find((i) => i.id === selectedId) ?? null;

  const paperResults = selected?.paper_results ?? [];
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(paperResults[0]?.id ?? null);
  const selectedPaper = paperResults.find((p) => p.id === selectedPaperId) ?? null;
  const [draft, setDraft] = useState(selectedPaper?.evaluation ?? "");

  useEffect(() => {
    // When batch selection changes, default to its first paper.
    const first = (selected?.paper_results ?? [])[0];
    setSelectedPaperId(first?.id ?? null);
    setDraft(first?.evaluation ?? "");
  }, [selectedId]);

  useEffect(() => {
    // When paper selection changes, sync draft.
    setDraft(selectedPaper?.evaluation ?? "");
  }, [selectedPaperId]);

  const selectBatch = (id: string) => {
    setSelectedId(id);
  };

  const selectPaper = (id: string) => {
    setSelectedPaperId(id);
    const next = (selected?.paper_results ?? []).find((p) => p.id === id);
    setDraft(next?.evaluation ?? "");
  };

  const savePaper = () => {
    if (!selected || !selectedPaper) return;
    const nextPapers = (selected.paper_results ?? []).map((p) =>
      p.id === selectedPaper.id ? { ...p, evaluation: draft } : p
    );
    updateHistoryItem(selected.id, { paper_results: nextPapers });
    toast({
      title: "Saved",
      description: "Paper evaluation updated (demo).",
    });
  };

  const finalizeBatch = () => {
    if (!selected) return;
    updateHistoryItem(selected.id, { is_finalized: true });
    toast({
      title: "Finalized",
      description: "You can now download the PDF.",
    });
  };

  const downloadPdf = () => {
    if (!selected) return;
    downloadBatchResultsPdf(selected);
  };

  return (
    <Layout>
      <div className="container-custom section-padding max-w-5xl mx-auto relative">
        <DoodleBackground />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="secondary" className="px-3 py-1">
              Teacher
            </Badge>
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">Edit Results</h1>
          <p className="text-muted-foreground mb-8">
            Edit the evaluation text for previously processed batches.
          </p>

        {items.length === 0 ? (
          <div className="glass-card p-6">
            <p className="text-muted-foreground">No results yet.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Batches */}
            <div className="lg:col-span-3">
              <div className="glass-card p-4 space-y-2">
                {items.map((item) => (
                  <button
                    key={item.id}
                    className={
                      "w-full text-left px-3 py-2 rounded-xl transition-all " +
                      (item.id === selectedId
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground")
                    }
                    onClick={() => selectBatch(item.id)}
                  >
                    <p className="text-sm font-medium">
                      {item.title || "Untitled batch"}
                    </p>
                    <p className="text-xs opacity-70">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                    <p className="text-xs opacity-70">
                      {(item.paper_results?.length ?? item.file_names.length) || 0} papers
                      {item.is_finalized ? " • Finalized" : ""}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Papers */}
            <div className="lg:col-span-3">
              <div className="glass-card p-4">
                <p className="font-medium mb-3">Papers</p>
                {paperResults.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Select a batch with papers.</p>
                ) : (
                  <div className="space-y-2">
                    {paperResults.map((p) => (
                      <button
                        key={p.id}
                        className={
                          "w-full text-left px-3 py-2 rounded-xl transition-all " +
                          (p.id === selectedPaperId
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground")
                        }
                        onClick={() => selectPaper(p.id)}
                      >
                        <p className="text-sm font-medium truncate">{p.file_name}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Editor */}
            <div className="lg:col-span-6">
              <div className="glass-card p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div>
                    <p className="font-medium">
                      {selected?.title || "Untitled batch"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedPaper ? selectedPaper.file_name : "Select a paper"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={finalizeBatch}
                      disabled={!selected || selected.is_finalized}
                    >
                      {selected?.is_finalized ? "Finalized" : "Finalize"}
                    </Button>
                    <Button
                      variant="hero"
                      onClick={downloadPdf}
                      disabled={!selected || !selected.is_finalized}
                    >
                      Download PDF
                    </Button>
                  </div>
                </div>

                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="min-h-[260px]"
                  placeholder="Edit evaluation for the selected paper..."
                  disabled={!selectedPaper}
                />

                <div className="mt-4 flex gap-3">
                  <Button variant="hero" onClick={savePaper} disabled={!selectedPaper}>
                    Save Paper
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setDraft(selectedPaper?.evaluation ?? "")}
                    disabled={!selectedPaper}
                  >
                    Reset
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-4">
                  Demo only: edits are saved to local state/storage.
                </p>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </Layout>
  );
}
