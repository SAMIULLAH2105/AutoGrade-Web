import { jsPDF } from "jspdf";
import type { HistoryItem } from "@/types/api";

function safeLine(text: string): string {
  return (text ?? "").toString().replace(/\r/g, "");
}

export function downloadBatchResultsPdf(batch: HistoryItem) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const maxWidth = pageWidth - margin * 2;

  let y = margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  const title = batch.title || "Batch Results";
  doc.text(title, margin, y);
  y += 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
  y += 14;
  doc.text(`Batch created: ${new Date(batch.created_at).toLocaleString()}`, margin, y);
  y += 22;

  const papers = batch.paper_results ?? [];

  if (papers.length === 0) {
    doc.setFontSize(12);
    doc.text("No paper results found.", margin, y);
  } else {
    papers.forEach((paper, index) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      const header = `${index + 1}. ${paper.file_name}`;
      const headerLines = doc.splitTextToSize(header, maxWidth);
      doc.text(headerLines, margin, y);
      y += headerLines.length * 14 + 6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const body = safeLine(paper.evaluation || "");
      const bodyLines = doc.splitTextToSize(body || "(no evaluation)", maxWidth);
      doc.text(bodyLines, margin, y);
      y += bodyLines.length * 12 + 14;

      // Simple page-break.
      const pageHeight = doc.internal.pageSize.getHeight();
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    });
  }

  const fileSafeTitle = title
    .replace(/[^a-z0-9\-\s_]/gi, "")
    .trim()
    .replace(/\s+/g, "_");

  doc.save(`${fileSafeTitle || "batch_results"}.pdf`);
}
