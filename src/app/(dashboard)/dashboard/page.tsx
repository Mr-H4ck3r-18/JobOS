import { Suspense } from "react";
import { Bot, FileText } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentAppUser } from "@/lib/auth/current-user";
import { DashboardContent } from "./dashboard-content";
import { DashboardSkeleton } from "./dashboard-skeleton";

export default async function DashboardPage() {
  const currentUser = await getCurrentAppUser();
  if (!currentUser.ok) return null;

  return (
    <main className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <Badge variant="secondary" className="w-fit">
            Career operating system
          </Badge>
          <div>
            <h1 className="text-3xl font-semibold tracking-normal text-foreground md:text-4xl">
              Prioritize the roles worth your attention.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Discover jobs, score them against your resume, prepare tailored drafts,
              and keep every application behind a manual approval step.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" asChild>
            <Link href="/resumes">
              <FileText className="h-4 w-4 mr-2" />
              Upload resume
            </Link>
          </Button>
          <Button asChild>
            <Link href="/jobs">
              <Bot className="h-4 w-4 mr-2" />
              Run job search
            </Link>
          </Button>
        </div>
      </section>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent userId={currentUser.user.id} />
      </Suspense>
    </main>
  );
}
