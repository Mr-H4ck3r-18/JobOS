import { Metadata } from "next";
import { JobStatus, JobSource, Prisma } from "@prisma/client";
import { getCurrentAppUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";
import { JobsTable } from "@/features/jobs/components/jobs-table";
import { JobFilters } from "@/features/jobs/components/job-filters";
import { JobIngestionTrigger } from "@/features/jobs/components/job-ingestion-trigger";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Jobs | JobOS",
  description: "Manage and discover job opportunities.",
};

interface JobsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const currentUser = await getCurrentAppUser();
  if (!currentUser.ok) return null; // Handled by middleware

  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : undefined;
  const statusFilter = typeof params.status === "string" ? params.status as JobStatus : undefined;
  const sourceFilter = typeof params.source === "string" ? params.source as JobSource : undefined;
  const page = typeof params.page === "string" ? parseInt(params.page) : 1;
  const limit = 20;

  const whereClause: Prisma.JobWhereInput = {
    userId: currentUser.user.id,
  };

  if (query) {
    whereClause.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { company: { contains: query, mode: "insensitive" } },
    ];
  }

  if (statusFilter) {
    whereClause.status = statusFilter;
  } else {
    // Hide HIDDEN and EXPIRED by default unless explicitly requested
    whereClause.status = {
      notIn: [JobStatus.HIDDEN, JobStatus.EXPIRED],
    };
  }

  if (sourceFilter) {
    whereClause.source = sourceFilter;
  }

  const [jobs, totalCount] = await Promise.all([
    prisma.job.findMany({
      where: whereClause,
      include: {
        matches: {
          where: { userId: currentUser.user.id },
          select: { score: true },
          take: 1,
        }
      },
      orderBy: { postedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.job.count({ where: whereClause }),
  ]);

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
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Discovered Roles</CardTitle>
            <CardDescription>{totalCount} total</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <JobFilters />
          <JobsTable jobs={jobs} />
          
          {/* Basic pagination controls */}
          {totalCount > limit && (
            <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
              <span>Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalCount)} of {totalCount}</span>
              <div className="flex gap-2">
                {page > 1 && (
                  <a href={`?page=${page - 1}`} className="hover:text-primary transition-colors">Previous</a>
                )}
                {page * limit < totalCount && (
                  <a href={`?page=${page + 1}`} className="hover:text-primary transition-colors">Next</a>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
