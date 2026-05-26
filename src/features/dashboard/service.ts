import { prisma } from "@/lib/prisma";
import { JobStatus, ApplicationStatus } from "@prisma/client";

export async function getDashboardMetrics(userId: string) {
  const [
    jobStatusCounts,
    appStatusCounts,
    recentActivity,
    topMatches,
  ] = await Promise.all([
    // Group jobs by status
    prisma.job.groupBy({
      by: ["status"],
      _count: { status: true },
      where: { userId },
    }),
    // Group applications by status
    prisma.application.groupBy({
      by: ["status"],
      _count: { status: true },
      where: { userId },
    }),
    // Recent activity logs
    prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        type: true,
        message: true,
        createdAt: true,
      },
    }),
    // Top matches
    prisma.jobMatch.findMany({
      where: { userId },
      select: {
        id: true,
        jobId: true,
        score: true,
        job: {
          select: { id: true, title: true, company: true },
        },
      },
      orderBy: { score: "desc" },
      take: 3,
    }),
  ]);

  // Jobs aggregation
  let totalJobs = 0;
  let matchedJobs = 0;
  let savedJobs = 0;

  for (const group of jobStatusCounts) {
    totalJobs += group._count.status;
    if (group.status === JobStatus.MATCHED) matchedJobs += group._count.status;
    if (group.status === JobStatus.SAVED) savedJobs += group._count.status;
  }

  // Applications aggregation
  let totalApps = 0;
  let interviews = 0;
  let rejections = 0;
  let reviewCount = 0;
  let appliedCount = 0;

  for (const group of appStatusCounts) {
    totalApps += group._count.status;
    if (group.status === ApplicationStatus.INTERVIEWING) interviews += group._count.status;
    if (group.status === ApplicationStatus.REJECTED) rejections += group._count.status;
    if (group.status === ApplicationStatus.NEEDS_REVIEW || group.status === ApplicationStatus.DRAFT) {
      reviewCount += group._count.status;
    }
    if (group.status === ApplicationStatus.APPLIED) appliedCount += group._count.status;
  }

  // Also count matches specifically (score > 0)
  // Actually, we consider a job "matched" if its status is MATCHED or if there's a JobMatch.
  // We'll rely on the status grouping.

  return {
    metrics: {
      totalJobs,
      matchedJobs,
      savedJobs,
      totalApps,
      interviews,
      rejections,
    },
    pipeline: [
      { label: "Found", value: totalJobs },
      { label: "Matched", value: matchedJobs },
      { label: "Review", value: reviewCount },
      { label: "Applied", value: appliedCount },
      { label: "Interview", value: interviews },
    ],
    recentActivity,
    topMatches,
  };
}
