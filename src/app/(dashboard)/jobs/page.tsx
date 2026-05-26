import { Suspense } from "react";
import { Metadata } from "next";
import { JobIngestionTrigger } from "@/features/jobs/components/job-ingestion-trigger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobsContent } from "./jobs-content";
import { TableSkeleton } from "@/components/ui/table-skeleton";

export const metadata: Metadata = {
  title: "Jobs | JobOS",
  description: "Manage and discover job opportunities.",
};

interface JobsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function JobsPage({ searchParams }: JobsPageProps) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
          <p className="text-muted-foreground mt-1">Discover and manage your job opportunities.</p>
        </div>
        <JobIngestionTrigger />
      </div>

      <Card className="border-border/50 bg-background/60 shadow-xl backdrop-blur-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Discovered Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TableSkeleton rows={10} />}>
            <JobsContent searchParamsPromise={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
