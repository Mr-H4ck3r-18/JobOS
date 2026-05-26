"use client";

import { FileText, MoreHorizontal } from "lucide-react";

import { ArchiveResumeButton } from "@/features/resumes/components/resume-actions";
import type { ResumeListItem } from "@/features/resumes/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ResumeListProps = {
  resumes: ResumeListItem[];
  selectedResumeId: string | null;
  onSelectResume: (resumeId: string) => void;
};

export function ResumeList({ resumes, selectedResumeId, onSelectResume }: ResumeListProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Resume Library</CardTitle>
        <Badge variant="outline">{resumes.length} total</Badge>
      </CardHeader>
      <CardContent>
        {resumes.length === 0 ? (
          <div className="rounded-lg border border-border/70 bg-secondary/25 p-5 text-sm leading-6 text-muted-foreground">
            Upload your master resume first. Tailored and recruiter-specific versions can be
            added after the master source exists.
          </div>
        ) : (
          <div className="space-y-2">
            {resumes.map((resume) => {
              const active = resume.id === selectedResumeId;

              return (
                <div
                  key={resume.id}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg border border-border/70 bg-card/70 p-3 transition duration-200",
                    active && "border-primary/60 bg-primary/8",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onSelectResume(resume.id)}
                    className="flex min-w-0 flex-1 items-center gap-3 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                      <FileText className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-foreground">
                        {resume.title}
                      </span>
                      <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatResumeStatus(resume.status)}</span>
                        <span>{resume.originalFileName ?? "No file name"}</span>
                        {resume.parseError ? <span className="text-destructive">Needs text review</span> : null}
                      </span>
                    </span>
                  </button>
                  <ArchiveResumeButton resume={resume}>
                    <Button variant="ghost" size="icon" aria-label={`Archive ${resume.title}`}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </ArchiveResumeButton>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function formatResumeStatus(status: ResumeListItem["status"]) {
  return status
    .toLowerCase()
    .replace("_", "-")
    .replace(/^\w/, (letter) => letter.toUpperCase());
}
