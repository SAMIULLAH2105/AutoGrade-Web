import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/state/AppContext";
import { usePaperApi } from "@/services/usePaperApi";
import { DoodleBackground } from "@/components/decor/DoodleBackground";
import { useAuth } from "@/state/AppContext";

function extractScoreLine(text: string): string {
  const match = text.match(/Score\s*:?\s*\d+\/\d+/i);
  return match ? match[0] : "";
}

export default function HistoryPage() {
  const { history } = useAppData();
  const { getHistory } = usePaperApi();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    getHistory()
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load history");
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [getHistory]);

  const items = useMemo(
    () => [...history].sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [history]
  );

  const uploadHref = user?.role === "teacher" ? "/teacher/upload-batch" : "/upload";
  const uploadCta = user?.role === "teacher" ? "Upload a new batch" : "Upload new paper";

  return (
    <Layout>
      <div className="container-custom section-padding max-w-4xl mx-auto relative">
        <DoodleBackground />
        <div className="relative">
          <h1 className="font-display text-3xl font-bold mb-2">History</h1>
          <p className="text-muted-foreground mb-8">Your previously checked papers.</p>

          {error && (
            <div className="glass-card p-4 mb-6">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="glass-card p-6">
              <p className="text-muted-foreground">Loading history...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="glass-card p-6">
              <p className="text-muted-foreground">No history yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const scoreLine = extractScoreLine(item.evaluation);
                return (
                  <div key={item.id} className="glass-card-hover p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <p className="font-medium">
                          {new Date(item.created_at).toLocaleString()}
                        </p>
                        {item.title ? <p className="text-sm">{item.title}</p> : null}
                        <p className="text-sm text-muted-foreground">
                          {item.file_names.join(", ")}
                        </p>
                      </div>
                      {scoreLine ? (
                        <p className="font-semibold text-primary">{scoreLine}</p>
                      ) : null}
                    </div>

                    {item.message ? (
                      <p className="text-sm text-muted-foreground mt-3">{item.message}</p>
                    ) : null}

                    <details className="mt-4">
                      <summary className="cursor-pointer select-none text-sm text-muted-foreground hover:text-foreground transition-colors">
                        View evaluation
                      </summary>
                      <pre className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
                        {item.evaluation}
                      </pre>
                    </details>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-10">
            <Button variant="hero" asChild>
              <Link to={uploadHref}>{uploadCta}</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
