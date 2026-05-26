"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FileUp, Loader2, UploadCloud } from "lucide-react";

import { uploadResumeAction } from "@/features/resumes/actions";
import { initialResumeActionState } from "@/features/resumes/types";
import { MAX_RESUME_SIZE_BYTES } from "@/features/resumes/validation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ResumeUploadDropzoneProps = {
  hasMaster: boolean;
};

export function ResumeUploadDropzone({ hasMaster }: ResumeUploadDropzoneProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(uploadResumeAction, initialResumeActionState);
  const [isPending, startTransition] = useTransition();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isPending) {
      setProgress(state.ok ? 100 : 0);
      return;
    }

    setProgress(18);
    const interval = window.setInterval(() => {
      setProgress((value) => Math.min(value + 13, 92));
    }, 220);

    return () => window.clearInterval(interval);
  }, [isPending, state.ok]);

  useEffect(() => {
    if (state.message) {
      router.refresh();
    }
  }, [router, state.message]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (selectedFile) {
      formData.set("file", selectedFile);
    }

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Resume</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <label
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              setSelectedFile(event.dataTransfer.files[0] ?? null);
            }}
            className={cn(
              "flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border/80 bg-secondary/30 p-6 text-center outline-none transition duration-200 hover:border-primary/70 hover:bg-secondary/45 focus-within:ring-2 focus-within:ring-ring",
              isDragging && "border-primary bg-primary/10",
            )}
          >
            <input
              name="file"
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="sr-only"
              onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
            />
            <motion.span
              animate={{ y: isDragging ? -3 : 0, scale: isDragging ? 1.03 : 1 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-card text-primary"
            >
              <UploadCloud className="h-5 w-5" />
            </motion.span>
            <span className="text-sm font-medium text-foreground">
              {selectedFile ? selectedFile.name : "Drop a PDF or DOCX resume here"}
            </span>
            <span className="mt-2 max-w-sm text-xs leading-5 text-muted-foreground">
              Files are stored in Supabase Storage. Text extraction runs server-side,
              with manual fallback if the document cannot be parsed.
            </span>
            <span className="mt-3 font-mono text-[11px] text-muted-foreground">
              Max {Math.floor(MAX_RESUME_SIZE_BYTES / 1024 / 1024)} MB
            </span>
          </label>

          <div className="grid gap-3 md:grid-cols-[1fr_180px]">
            <label className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground">Title</span>
              <input
                name="title"
                required
                maxLength={120}
                placeholder="Master resume, Backend-focused resume"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground">Type</span>
              <select
                name="status"
                defaultValue={hasMaster ? "TAILORED" : "MASTER"}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring"
              >
                <option value="MASTER" disabled={hasMaster}>
                  Master
                </option>
                <option value="TAILORED">Tailored</option>
                <option value="RECRUITER_SPECIFIC">Recruiter-specific</option>
              </select>
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground">
              Manual text fallback
            </span>
            <textarea
              name="manualText"
              rows={4}
              placeholder="Optional. Paste resume text here if the file is image-based or hard to parse."
              className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm leading-6 text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-ring"
            />
          </label>

          <AnimatePresence>
            {isPending && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-2 rounded-md border border-border/70 bg-secondary/30 p-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Uploading, parsing, and saving metadata</span>
                    <span className="font-mono">{progress}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-[width] duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {state.message ? (
            <p className={cn("text-sm", state.ok ? "text-accent" : "text-destructive")}>
              {state.message}
            </p>
          ) : null}

          <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
            Upload resume
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
