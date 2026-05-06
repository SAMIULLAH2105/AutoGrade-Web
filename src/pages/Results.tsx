import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/state/AppContext";
import { DoodleBackground } from "@/components/decor/DoodleBackground";
import type { ExtractTextResultItem } from "@/types/api";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

function parseScore(score: string | undefined): { earned: number; outOf: number } | null {
  if (!score) return null;
  const match = score.trim().match(/^(\d+)\s*\/\s*(\d+)$/);
  if (!match) return null;
  return { earned: Number(match[1]), outOf: Number(match[2]) };
}

function scoreBadgeVariant(score: string | undefined): "default" | "secondary" | "destructive" {
  const parsed = parseScore(score);
  if (!parsed || parsed.outOf <= 0) return "secondary";
  if (parsed.earned <= 0) return "destructive";
  if (parsed.earned < parsed.outOf) return "secondary";
  return "default";
}

export default function ResultsPage() {
  const { latestResult, history } = useAppData();
  const result = latestResult ?? history[0] ?? null;

  if (!result) {
    return (
      <Layout>
        <div className="container-custom section-padding max-w-3xl mx-auto relative">
          <DoodleBackground />
          <div className="relative text-center">
            <div className="glass-card p-8">
              <p className="text-muted-foreground">
                No result available. Please upload a paper first.
              </p>
              <Link to="/upload">
                <Button variant="hero" className="mt-6">
                  Go to Upload
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const evaluationText = result.evaluation;
  const message = result.message ?? null;
  const extractResults: ExtractTextResultItem[] | undefined = result.extract_results;

  return (
    <Layout>
      <div className="container-custom section-padding max-w-3xl mx-auto relative">
        <DoodleBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Back Button */}
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Upload another paper
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
              Your <span className="gradient-text">Evaluation</span>
            </h1>
            <p className="text-lg font-medium text-primary">Result ready</p>
          </div>

          {/* Structured results (preferred) */}
          {extractResults && extractResults.length > 0 ? (
            <div className="glass-card-hover p-6">
              <Accordion type="multiple" className="w-full">
                {extractResults.map((file, idx) => {
                  const evalObj = file.evaluation;
                  const questions = evalObj?.questions ?? [];

                  return (
                    <AccordionItem
                      key={`${file.file_name}-${idx}`}
                      value={`${file.file_name}-${idx}`}
                    >
                      <AccordionTrigger>
                        <div className="flex flex-1 items-center justify-between gap-3 pr-3">
                          <div className="min-w-0 text-left">
                            <div className="font-semibold truncate">{file.file_name}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {file.content_type}
                            </div>
                          </div>
                          {typeof evalObj?.total_score === "number" ? (
                            <Badge variant="secondary">Total: {evalObj.total_score}</Badge>
                          ) : null}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        {questions.length > 0 ? (
                          <div className="space-y-4">
                            {questions.map((q) => (
                              <div key={q.question_id} className="glass-card p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                  <div className="min-w-0">
                                    <div className="font-medium truncate">Question ID: {q.question_id}</div>
                                    {q.source ? (
                                      <div className="text-xs text-muted-foreground">Source: {q.source}</div>
                                    ) : null}
                                  </div>
                                  {q.score ? (
                                    <Badge variant={scoreBadgeVariant(q.score)}>{q.score}</Badge>
                                  ) : null}
                                </div>

                                {q.answer_text?.trim() ? (
                                  <div className="mt-3">
                                    <div className="text-sm font-semibold mb-1">Answer</div>
                                    <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
                                      {q.answer_text}
                                    </pre>
                                  </div>
                                ) : null}

                                {q.comments?.trim() ? (
                                  <div className="mt-3">
                                    <div className="text-sm font-semibold mb-1">Feedback</div>
                                    <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
                                      {q.comments}
                                    </pre>
                                  </div>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            No question-level evaluation returned for this file.
                          </div>
                        )}

                        {file.extracted_text?.trim() ? (
                          <details className="mt-4">
                            <summary className="cursor-pointer select-none text-sm text-muted-foreground hover:text-foreground transition-colors">
                              View extracted text
                            </summary>
                            <pre className="mt-3 whitespace-pre-wrap text-xs text-muted-foreground">
                              {file.extracted_text}
                            </pre>
                          </details>
                        ) : null}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          ) : (
            /* Fallback (legacy text evaluation) */
            <div className="glass-card-hover p-6 space-y-4">
              <h2 className="font-semibold text-xl mb-2">Evaluation</h2>
              {evaluationText.trim().length > 0 ? (
                <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {evaluationText}
                </pre>
              ) : (
                <p className="text-muted-foreground">No evaluation available.</p>
              )}
            </div>
          )}

          {/* Optional message */}
          {message && (
            <p className="text-sm text-muted-foreground mt-4 text-center">{message}</p>
          )}

          {/* CTA */}
          <div className="mt-8 text-center">
            <Link to="/upload">
              <Button variant="hero" size="xl">
                Check Another Paper
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
