import { AlertCircle, FileText } from "lucide-react";

import { ResumeWorkspace } from "@/features/resumes/components/resume-workspace";
import { getResumePageData } from "@/features/resumes/data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function ResumesPage() {
  const { currentUser, resumes } = await getResumePageData();

  if (!currentUser.ok) {
    return (
      <main className="space-y-6">
        <section className="max-w-3xl space-y-3">
          <Badge variant="secondary" className="w-fit">
            Resume intelligence
          </Badge>
          <h1 className="text-3xl font-semibold tracking-normal text-foreground">
            Upload the resume your matching engine will trust.
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Master resumes stay permanent. Tailored and recruiter-specific versions
            will branch from that source later.
          </p>
        </section>

        <Card>
          <CardContent className="flex min-h-[360px] flex-col items-center justify-center p-8 text-center">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-secondary text-primary">
              {currentUser.reason === "missing-env" ? (
                <AlertCircle className="h-5 w-5" />
              ) : (
                <FileText className="h-5 w-5" />
              )}
            </span>
            <h2 className="text-xl font-semibold text-foreground">Resume storage is waiting</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              {currentUser.message} Once Supabase Auth and database credentials are
              configured, this page will upload PDF and DOCX resumes to Supabase Storage.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return <ResumeWorkspace resumes={resumes} />;
}
