"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ExternalLink, Save, ShieldCheck } from "lucide-react";

import { updateResumeTextAction } from "@/features/resumes/actions";
import { initialResumeActionState, type ResumeListItem } from "@/features/resumes/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ResumePreviewProps = {
  resume: ResumeListItem;
};

export function ResumePreview({ resume }: ResumePreviewProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    updateResumeTextAction,
    initialResumeActionState,
  );

  useEffect(() => {
    if (state.ok) {
      router.refresh();
    }
  }, [router, state.ok]);

  return (
    <Card className="sticky top-20">
      <CardHeader className="gap-4 md:flex-row md:items-start md:justify-between md:space-y-0">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant={resume.status === "MASTER" ? "default" : "secondary"}>
              {resume.status.toLowerCase().replace("_", " ")}
            </Badge>
            {resume.parseError ? (
              <Badge variant="outline">Text review needed</Badge>
            ) : (
              <Badge variant="outline">Parsed text ready</Badge>
            )}
          </div>
          <CardTitle className="truncate text-base">{resume.title}</CardTitle>
          <p className="mt-2 text-xs text-muted-foreground">
            Updated {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(resume.updatedAt))}
          </p>
        </div>
        {resume.previewUrl ? (
          <Button asChild variant="secondary" size="sm">
            <a href={resume.previewUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" />
              Open file
            </a>
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        {resume.parseError ? (
          <div className="flex gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <p className="text-sm leading-6 text-muted-foreground">
              {resume.parseError} Paste cleaned resume text below to keep matching available.
            </p>
          </div>
        ) : (
          <div className="flex gap-3 rounded-lg border border-border/70 bg-secondary/25 p-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <p className="text-sm leading-6 text-muted-foreground">
              Parsed text is stored separately from the original file, so future matching
              can run without touching the master document.
            </p>
          </div>
        )}

        <form action={formAction} className="space-y-3">
          <input type="hidden" name="resumeId" value={resume.id} />
          <label className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground">Parsed resume text</span>
            <textarea
              key={resume.id}
              name="parsedText"
              defaultValue={resume.parsedText ?? ""}
              rows={18}
              placeholder="Paste or edit resume text here."
              className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 font-mono text-xs leading-6 text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-ring"
            />
          </label>

          {state.message && state.resumeId === resume.id ? (
            <p className={cn("text-sm", state.ok ? "text-accent" : "text-destructive")}>
              {state.message}
            </p>
          ) : null}

          <Button type="submit" variant="secondary" disabled={isPending}>
            <Save className="h-4 w-4" />
            Save text
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
