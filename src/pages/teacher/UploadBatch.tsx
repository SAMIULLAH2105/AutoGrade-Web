import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, Loader2, CheckCircle2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { usePaperApi } from "@/services/usePaperApi";
import { useNavigate } from "react-router-dom";
import { DoodleBackground } from "@/components/decor/DoodleBackground";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UploadedPaper {
  file: File;
  id: string;
}

export default function TeacherUploadBatchPage() {
  const [files, setFiles] = useState<UploadedPaper[]>([]);
  const [subject, setSubject] = useState<"isl" | "chem" | "math" | "physics" | "">("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { extractText } = usePaperApi();
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      id: crypto.randomUUID(),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: 20 * 1024 * 1024, // 20MB
  });

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmit = async () => {
    if (!subject) {
      toast({
        title: "Subject required",
        description: "Please select a subject before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload one or more PDFs.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(5);

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    try {
      await sleep(350);
      setUploadProgress(25);

      await sleep(450);
      setUploadProgress(55);

      await sleep(450);
      setUploadProgress(80);

      await extractText(
        files.map((f) => f.file),
        { subject }
      );

      setUploadProgress(100);
      toast({
        title: "Batch processed",
        description: "Redirecting to history...",
      });

      setTimeout(() => {
        navigate("/history");
      }, 800);
    } catch (e: unknown) {
      toast({
        title: "Upload failed",
        description: e instanceof Error ? e.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Layout>
      <div className="container-custom section-padding relative">
        <DoodleBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mx-auto relative"
        >
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <Badge variant="secondary" className="px-4 py-1 text-sm">
                Teacher
              </Badge>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">
              Upload <span className="gradient-text">Batch</span>
            </h1>
            <p className="text-muted-foreground">
              Upload multiple PDFs to evaluate and save to history.
            </p>
          </div>

          <div className="glass-card p-6 mb-6">
            <Label htmlFor="subject">Subject</Label>
            <Select
              value={subject}
              onValueChange={(v) => setSubject(v as typeof subject)}
              disabled={isUploading}
            >
              <SelectTrigger id="subject" className="mt-2">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="isl">Islamiat</SelectItem>
                <SelectItem value="chem">Chemistry</SelectItem>
                <SelectItem value="math">Mathematics</SelectItem>
                <SelectItem value="physics">Physics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <motion.div>
            <div
              {...getRootProps()}
              className={
                "relative border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all duration-300 group " +
                (isDragActive
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : "border-border hover:border-primary/50 hover:bg-muted/50")
              }
            >
              <input {...getInputProps()} />
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl gradient-bg flex items-center justify-center">
                <Upload className="w-9 h-9 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">
                {isDragActive ? "Drop the PDFs here" : "Drag & drop PDFs"}
              </h3>
              <p className="text-muted-foreground">or click to browse</p>
              <div className="mt-4 text-sm text-muted-foreground">
                <span className="px-2 py-1 rounded-lg bg-muted">PDF</span>
                <span className="text-muted-foreground/60"> • Max 20MB each</span>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6"
              >
                <div className="space-y-3">
                  {files.map((f) => (
                    <div key={f.id} className="glass-card p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <FileText className="w-7 h-7 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{f.file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(f.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(f.id)}
                        disabled={isUploading}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isUploading && (
            <div className="mt-6 glass-card p-6">
              <div className="flex items-center gap-3">
                <Loader2 className="animate-spin" />
                <span>Processing batch...</span>
              </div>
              <div className="h-2 bg-muted rounded-full mt-4 overflow-hidden">
                <div className="h-full gradient-bg" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <Button
              variant="hero"
              size="xl"
              onClick={handleSubmit}
              disabled={files.length === 0 || !subject || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <CheckCircle2 /> Submit Batch
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
