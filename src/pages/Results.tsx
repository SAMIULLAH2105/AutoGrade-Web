import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/state/AppContext";
import { DoodleBackground } from "@/components/decor/DoodleBackground";

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

  // Extract score robustly
  const scoreMatch = evaluationText.match(/Score\s*:?\s*\d+\/\d+/i);
  const scoreLine = scoreMatch ? scoreMatch[0] : "";

  // Extract suggestions flexibly
  let suggestionLines: string[] = [];
  const suggestionIndex = evaluationText.search(/Suggestions for Improvement:/i);
  if (suggestionIndex !== -1) {
    const suggestionsText = evaluationText
      .substring(suggestionIndex + "Suggestions for Improvement:".length)
      .trim();

    // Split by newline and filter lines that are not empty
    suggestionLines = suggestionsText
      .split(/\r?\n/)
      .map((line) => line.replace(/^\*+\s*/, "").trim()) // remove bullets
      .filter((line) => line.length > 0);
  }

  const fileLines = result.file_names.map((name) => `${name} - processed`);

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
            {scoreLine ? (
              <p className="text-lg font-medium">{scoreLine}</p>
            ) : (
              <p className="text-lg font-medium text-primary">
                Demo analysis complete
              </p>
            )}
          </div>

          {/* Suggestions */}
          <div className="glass-card-hover p-6 space-y-4">
            <h2 className="font-semibold text-xl mb-2">Suggestions for Improvement:</h2>
            {suggestionLines.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {suggestionLines.map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            ) : fileLines.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {fileLines.map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No suggestions available.</p>
            )}
          </div>

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
