// import { useState, useCallback } from "react";
// import { useDropzone } from "react-dropzone";
// import { motion, AnimatePresence } from "framer-motion";
// import { Upload, FileText, X, CheckCircle2, Loader2, AlertCircle, Image } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Layout } from "@/components/layout/Layout";
// import { useNavigate } from "react-router-dom";
// import { toast } from "@/hooks/use-toast";

// interface UploadedFile {
//   file: File;
//   id: string;
//   preview?: string;
// }

// export default function UploadPage() {
//   const [files, setFiles] = useState<UploadedFile[]>([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const navigate = useNavigate();

//   const onDrop = useCallback((acceptedFiles: File[]) => {
//     const newFiles = acceptedFiles.map((file) => ({
//       file,
//       // id: Math.random().toString(36).substr(2, 9),
//       id: crypto.randomUUID(),
//       //URL.createObjectURL() creates a temporary local URL for a file or blob so the browser can use it like a real URL.
//       preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
//     }));
//     setFiles((prev) => [...prev, ...newFiles]);
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: {
//       "application/pdf": [".pdf"],
//       "image/jpeg": [".jpg", ".jpeg"],
//       "image/png": [".png"],
//     },
//     maxSize: 10 * 1024 * 1024, // 10MB
//   });

//   const removeFile = (id: string) => {
//     setFiles((prev) => {
//       const file = prev.find((f) => f.id === id);
//       if (file?.preview) URL.revokeObjectURL(file.preview);
//       return prev.filter((f) => f.id !== id);
//     });
//   };

//   const handleSubmit = async () => {
//     if (files.length === 0) {
//       toast({
//         title: "No files selected",
//         description: "Please upload at least one paper to check.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsUploading(true);
//     setUploadProgress(0);

//     // Simulate upload progress
//     const interval = setInterval(() => {
//       setUploadProgress((prev) => {
//         if (prev >= 100) {
//           clearInterval(interval);
//           return 100;
//         }
//         return prev + 10;
//       });
//     }, 200);

//     // Simulate API call to /api/check-paper
//     setTimeout(() => {
//       clearInterval(interval);
//       setUploadProgress(100);
      
//       toast({
//         title: "Papers submitted successfully!",
//         description: "Your papers are being processed. Redirecting to results...",
//       });

//       setTimeout(() => {
//         navigate("/results");
//       }, 1500);
//     }, 2500);
//   };

//   const getFileIcon = (file: File) => {
//     if (file.type === "application/pdf") {
//       return <FileText className="w-8 h-8 text-destructive" />;
//     }
//     return <Image className="w-8 h-8 text-primary" />;
//   };

//   return (
//     <Layout>
//       <div className="container-custom section-padding">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="max-w-3xl mx-auto"
//         >
//           {/* Header */}
//           <div className="text-center mb-12">
//             <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
//               Upload Your <span className="gradient-text">Paper</span>
//             </h1>
//             <p className="text-muted-foreground max-w-lg mx-auto">
//               Upload your O or A Level exam paper and get instant AI-powered feedback and marking.
//             </p>
//           </div>

//           {/* Dropzone */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.98 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.4, delay: 0.1 }}
//           >
//             <div
//               {...getRootProps()}
//               className={`
//                 relative border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer
//                 transition-all duration-300 group
//                 ${isDragActive 
//                   ? "border-primary bg-primary/5 scale-[1.02]" 
//                   : "border-border hover:border-primary/50 hover:bg-muted/50"
//                 }
//               `}
//             >
//               <input {...getInputProps()} />
              
//               <motion.div
//                 animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
//                 className="w-20 h-20 mx-auto mb-6 rounded-2xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow"
//               >
//                 <Upload className="w-9 h-9 text-primary-foreground" />
//               </motion.div>

//               <h3 className="font-display text-xl font-semibold mb-2">
//                 {isDragActive ? "Drop your files here" : "Drag & drop your papers"}
//               </h3>
//               <p className="text-muted-foreground mb-4">
//                 or click to browse from your device
//               </p>
//               <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
//                 <span className="px-2 py-1 rounded-lg bg-muted">PDF</span>
//                 <span className="px-2 py-1 rounded-lg bg-muted">JPG</span>
//                 <span className="px-2 py-1 rounded-lg bg-muted">PNG</span>
//                 <span className="text-muted-foreground/60">• Max 10MB</span>
//               </div>
//             </div>
//           </motion.div>

//           {/* File List */}
//           <AnimatePresence mode="popLayout">
//             {files.length > 0 && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 exit={{ opacity: 0, height: 0 }}
//                 className="mt-8 space-y-3"
//               >
//                 <h3 className="font-display font-semibold text-lg">
//                   Uploaded Files ({files.length})
//                 </h3>
                
//                 {files.map((uploadedFile) => (
//                   <motion.div
//                     key={uploadedFile.id}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: 20 }}
//                     className="glass-card p-4 flex items-center gap-4"
//                   >
//                     {uploadedFile.preview ? (
//                       <img
//                         src={uploadedFile.preview}
//                         alt="Preview"
//                         className="w-12 h-12 rounded-lg object-cover"
//                       />
//                     ) : (
//                       <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
//                         {getFileIcon(uploadedFile.file)}
//                       </div>
//                     )}
                    
//                     <div className="flex-1 min-w-0">
//                       <p className="font-medium truncate">{uploadedFile.file.name}</p>
//                       <p className="text-sm text-muted-foreground">
//                         {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
//                       </p>
//                     </div>

//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => removeFile(uploadedFile.id)}
//                       disabled={isUploading}
//                       className="text-muted-foreground hover:text-destructive"
//                     >
//                       <X className="w-5 h-5" />
//                     </Button>
//                   </motion.div>
//                 ))}
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* Upload Progress */}
//           <AnimatePresence>
//             {isUploading && (
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 className="mt-8"
//               >
//                 <div className="glass-card p-6">
//                   <div className="flex items-center gap-4 mb-4">
//                     <Loader2 className="w-6 h-6 text-primary animate-spin" />
//                     <span className="font-medium">Processing your papers...</span>
//                   </div>
//                   <div className="h-2 bg-muted rounded-full overflow-hidden">
//                     <motion.div
//                       initial={{ width: 0 }}
//                       animate={{ width: `${uploadProgress}%` }}
//                       className="h-full gradient-bg rounded-full"
//                     />
//                   </div>
//                   <p className="text-sm text-muted-foreground mt-2">
//                     {uploadProgress}% complete
//                   </p>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* Submit Button */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.3 }}
//             className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
//           >
//             <Button
//               variant="hero"
//               size="xl"
//               onClick={handleSubmit}
//               disabled={files.length === 0 || isUploading}
//               className="w-full sm:w-auto"
//             >
//               {isUploading ? (
//                 <>
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle2 className="w-5 h-5" />
//                   Submit for Checking
//                 </>
//               )}
//             </Button>
//           </motion.div>

//           {/* Info Cards */}
//           <div className="mt-16 grid sm:grid-cols-2 gap-6">
//             <div className="glass-card p-6">
//               <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
//                 <CheckCircle2 className="w-5 h-5 text-primary" />
//               </div>
//               <h3 className="font-display font-semibold mb-2">Supported Subjects</h3>
//               <p className="text-sm text-muted-foreground">
//                 Mathematics, Physics, Chemistry, Biology, English, and more O & A Level subjects.
//               </p>
//             </div>
            
//             <div className="glass-card p-6">
//               <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
//                 <AlertCircle className="w-5 h-5 text-accent" />
//               </div>
//               <h3 className="font-display font-semibold mb-2">Best Practices</h3>
//               <p className="text-sm text-muted-foreground">
//                 Ensure your paper is clearly visible, well-lit, and the entire page is captured.
//               </p>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </Layout>
//   );
// }
import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Image,
  Database,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { usePaperApi } from "@/services/usePaperApi";
import { DoodleBackground } from "@/components/decor/DoodleBackground";
import { Badge } from "@/components/ui/badge";

interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeProcessingStep, setActiveProcessingStep] = useState(0);
  const processingTimeoutsRef = useRef<number[]>([]);
  const navigate = useNavigate();
  const { extractText } = usePaperApi();

  const processingSteps = [
    {
      key: "extract",
      title: "Text Extraction",
      subtitle: "Reading your PDF/images",
      Icon: FileText,
    },
    {
      key: "pinecone",
      title: "Pinecone",
      subtitle: "Finding the right marking points",
      Icon: Database,
    },
    {
      key: "gemini",
      title: "Gemini",
      subtitle: "Understanding the answer",
      Icon: Sparkles,
    },
    {
      key: "evaluation",
      title: "Evaluation",
      subtitle: "Scoring and feedback",
      Icon: CheckCircle2,
    },
  ] as const;

  const clearProcessingTimeouts = () => {
    for (const id of processingTimeoutsRef.current) {
      window.clearTimeout(id);
    }
    processingTimeoutsRef.current = [];
  };

  const startProcessingAnimation = () => {
    clearProcessingTimeouts();
    setActiveProcessingStep(0);
    setUploadProgress(10);

    // We don't get real-time backend progress, so we animate a plausible flow.
    processingTimeoutsRef.current.push(
      window.setTimeout(() => {
        setActiveProcessingStep(1);
        setUploadProgress(30);
      }, 900)
    );
    processingTimeoutsRef.current.push(
      window.setTimeout(() => {
        setActiveProcessingStep(2);
        setUploadProgress(55);
      }, 2500)
    );
    processingTimeoutsRef.current.push(
      window.setTimeout(() => {
        setActiveProcessingStep(3);
        setUploadProgress(75);
      }, 4500)
    );
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      id: crypto.randomUUID(),
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) URL.revokeObjectURL(file.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload at least one paper to check.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    startProcessingAnimation();

    let succeeded = false;

    try {
      await extractText(files.map((f) => f.file));

      succeeded = true;
      clearProcessingTimeouts();
      setActiveProcessingStep(processingSteps.length - 1);

      setUploadProgress(95);
      setUploadProgress(100);

      toast({
        title: "Paper processed successfully!",
        description: "Redirecting to results...",
      });

      setTimeout(() => {
        setIsUploading(false);
        navigate("/results");
      }, 800);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";

      toast({
        title: "Upload failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      clearProcessingTimeouts();
      if (!succeeded) setIsUploading(false);
    }
  };


  const getFileIcon = (file: File) => {
    if (file.type === "application/pdf") {
      return <FileText className="w-8 h-8 text-destructive" />;
    }
    return <Image className="w-8 h-8 text-primary" />;
  };

  return (
    <Layout>
      <div className="container-custom section-padding relative">
        <DoodleBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto relative"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Badge variant="secondary" className="px-4 py-1 text-sm">
                Student
              </Badge>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Upload Your <span className="gradient-text">Paper</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Upload your O or A Level exam paper and get instant AI-powered
              feedback and marking.
            </p>
          </div>

          {/* Dropzone */}
          <motion.div>
            <div
              {...getRootProps()}
              className={`
                relative border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer
                transition-all duration-300 group
                ${
                  isDragActive
                    ? "border-primary bg-primary/5 scale-[1.02]"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }
              `}
            >
              <input {...getInputProps()} />
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl gradient-bg flex items-center justify-center">
                <Upload className="w-9 h-9 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">
                Drag & drop your papers
              </h3>
              <p className="text-muted-foreground mb-4">
                or click to browse
              </p>
            </div>
          </motion.div>

          {/* File List */}
          <AnimatePresence>
            {files.length > 0 && (
              <div className="mt-8 space-y-3">
                {files.map((uploadedFile) => (
                  <motion.div
                    key={uploadedFile.id}
                    className="glass-card p-4 flex items-center gap-4"
                  >
                    {uploadedFile.preview ? (
                      <img
                        src={uploadedFile.preview}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted flex items-center justify-center">
                        {getFileIcon(uploadedFile.file)}
                      </div>
                    )}

                    <div className="flex-1">
                      <p className="font-medium truncate">
                        {uploadedFile.file.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(uploadedFile.id)}
                      disabled={isUploading}
                    >
                      <X />
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-8 glass-card p-6">
              <div className="flex items-center gap-3">
                <Loader2 className="animate-spin" />
                <span>Processing your paper...</span>
              </div>
              <div className="h-2 bg-muted rounded-full mt-4 overflow-hidden">
                <div
                  className="h-full gradient-bg"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>

              {/* Fancy flow */}
              <div className="mt-6 grid gap-3">
                {processingSteps.map((step, idx) => {
                  const status =
                    idx < activeProcessingStep
                      ? "done"
                      : idx === activeProcessingStep
                        ? "active"
                        : "todo";

                  const Icon = step.Icon;

                  return (
                    <motion.div
                      key={step.key}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: status === "todo" ? 0.5 : 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center gap-3"
                    >
                      <div className="relative flex items-center justify-center">
                        <div
                          className={
                            "h-9 w-9 rounded-full flex items-center justify-center border bg-background" +
                            (status === "active"
                              ? " border-primary"
                              : status === "done"
                                ? " border-primary/50"
                                : " border-border")
                          }
                        >
                          <Icon
                            className={
                              "h-4 w-4" +
                              (status === "active"
                                ? " text-primary"
                                : status === "done"
                                  ? " text-primary"
                                  : " text-muted-foreground")
                            }
                          />
                        </div>

                        {status === "active" && (
                          <motion.div
                            className="absolute -inset-1 rounded-full border border-primary/40"
                            animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.08, 1] }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                          />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p
                            className={
                              "text-sm font-medium" +
                              (status === "todo" ? " text-muted-foreground" : "")
                            }
                          >
                            {step.title}
                          </p>
                          {status === "done" && (
                            <span className="text-xs text-muted-foreground">Done</span>
                          )}
                          {status === "active" && (
                            <span className="text-xs text-primary">In progress</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{step.subtitle}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <Button
              variant="hero"
              size="xl"
              onClick={handleSubmit}
              disabled={files.length === 0 || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 /> Submit for Checking
                </>
              )}
            </Button>
          </div>

          {/* Info Cards */}
          <div className="mt-16 grid sm:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <CheckCircle2 className="mb-2 text-primary" />
              <h3 className="font-semibold">Supported Subjects</h3>
              <p className="text-sm text-muted-foreground">
                Mathematics, Physics, Chemistry, Biology, English, and more.
              </p>
            </div>

            <div className="glass-card p-6">
              <AlertCircle className="mb-2 text-accent" />
              <h3 className="font-semibold">Best Practices</h3>
              <p className="text-sm text-muted-foreground">
                Ensure your paper is clearly visible and well-lit.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
