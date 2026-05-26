import { JobStatus, JobSource, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { JobsTable } from "@/features/jobs/components/jobs-table";
import { JobFilters } from "@/features/jobs/components/job-filters";
import { getCurrentAppUser } from "@/lib/auth/current-user";
import { redirect } from "next/navigation";

export async function JobsContent({ 
  searchParamsPromise 
}: { 
  searchParamsPromise: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const currentUser = await getCurrentAppUser();
  if (!currentUser.ok) redirect("/login");
  const userId = currentUser.user.id;

  const params = await searchParamsPromise;
  const query = typeof params.q === "string" ? params.q : undefined;
  const statusFilter = typeof params.status === "string" ? params.status as JobStatus : undefined;
  const sourceFilter = typeof params.source === "string" ? params.source as JobSource : undefined;
  const page = typeof params.page === "string" ? parseInt(params.page) : 1;
  const limit = 20;

  const whereClause: Prisma.JobWhereInput = { userId };

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
      select: {
        id: true,
        title: true,
        company: true,
        location: true,
        status: true,
        source: true,
        postedAt: true,
        url: true,
        matches: {
          where: { userId },
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
    <>
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">{totalCount} total jobs discovered</p>
      </div>
      <JobFilters />
      <JobsTable jobs={jobs} />
      
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
    </>
  );
}
