"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Archive, FileText, ShieldCheck } from "lucide-react";

import { ResumeList } from "@/features/resumes/components/resume-list";
import { ResumePreview } from "@/features/resumes/components/resume-preview";
import { ResumeUploadDropzone } from "@/features/resumes/components/resume-upload-dropzone";
import type { ResumeListItem } from "@/features/resumes/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type ResumeWorkspaceProps = {
  resumes: ResumeListItem[];
};

export function ResumeWorkspace({ resumes }: ResumeWorkspaceProps) {
  const [selectedResumeId, setSelectedResumeId] = useState(resumes[0]?.id ?? null);

  const selectedResume = useMemo(
    () => resumes.find((resume) => resume.id === selectedResumeId) ?? resumes[0] ?? null,
    [resumes, selectedResumeId],
  );

  const activeCount = resumes.filter((resume) => resume.status !== "ARCHIVED").length;
  const parsedCount = resumes.filter((resume) => resume.parsedText && !resume.parseError).length;
  const stats: Array<[number, string, LucideIcon]> = [
    [activeCount, "active", FileText],
    [parsedCount, "parsed", ShieldCheck],
    [resumes.length - activeCount, "archived", Archive],
  ];

  return (
    <main className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <Badge variant="secondary" className="w-fit">
            Resume intelligence
          </Badge>
          <div>
            <h1 className="text-3xl font-semibold tracking-normal text-foreground md:text-4xl">
              Manage the source material for every match.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Upload PDF or DOCX resumes, extract text for matching, and keep your
              master resume protected while future tailored versions branch from it.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:min-w-[360px]">
          {stats.map(([value, label, Icon]) => (
            <div
              key={label}
              className="rounded-lg border border-border/70 bg-card/75 px-3 py-3"
            >
              <Icon className="mb-3 h-4 w-4 text-muted-foreground" />
              <p className="font-mono text-lg text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4"
        >
          <ResumeUploadDropzone hasMaster={resumes.some((resume) => resume.status === "MASTER")} />
          <ResumeList
            resumes={resumes}
            selectedResumeId={selectedResume?.id ?? null}
            onSelectResume={setSelectedResumeId}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1], delay: 0.03 }}
        >
          {selectedResume ? (
            <ResumePreview resume={selectedResume} />
          ) : (
            <Card>
              <CardContent className="flex min-h-[520px] flex-col items-center justify-center p-8 text-center">
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-secondary text-primary">
                  <FileText className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-semibold text-foreground">No resumes yet</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  Upload your master resume first. If parsing fails, you can paste the
                  text manually and still use it for matching.
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </section>
    </main>
  );
}
