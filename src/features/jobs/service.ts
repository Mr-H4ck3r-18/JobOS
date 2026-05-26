import { JobSource, JobStatus, AutomationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { JobIngestionAdapter, IngestionResult } from "./types";
import { RemoteOkAdapter } from "./adapters/remoteok";
import { GreenhouseAdapter } from "./adapters/greenhouse";
import { LeverAdapter } from "./adapters/lever";
import { YcJobsAdapter } from "./adapters/yc";
import { normalizeCompanyName, normalizeJobTitle, normalizeLocation, normalizeText } from "./utilities/normalization";

const ADAPTERS: Record<JobSource, JobIngestionAdapter | null> = {
  [JobSource.REMOTE_OK]: new RemoteOkAdapter(),
  [JobSource.GREENHOUSE]: new GreenhouseAdapter(),
  [JobSource.LEVER]: new LeverAdapter(),
  [JobSource.YC_JOBS]: new YcJobsAdapter(),
  [JobSource.WELLFOUND]: null,
  [JobSource.COMPANY_SITE]: null,
  [JobSource.MANUAL]: null,
};

export async function runJobIngestion(
  userId: string,
  source: JobSource,
  query?: string,
  company?: string
): Promise<IngestionResult> {
  const adapter = ADAPTERS[source];

  if (!adapter) {
    return {
      source,
      success: false,
      jobsProcessed: 0,
      jobsAdded: 0,
      error: `No adapter implemented for ${source}`,
    };
  }

  // Create an AutomationRun record
  const automationRun = await prisma.automationRun.create({
    data: {
      userId,
      name: `Job Ingestion: ${source}`,
      source,
      status: AutomationStatus.RUNNING,
      startedAt: new Date(),
      input: { query, company },
    },
  });

  try {
    const rawJobs = await adapter.ingest(query, company);
    let addedCount = 0;

    for (const job of rawJobs) {
      const normalizedCompany = normalizeCompanyName(job.company);
      const normalizedTitle = normalizeJobTitle(job.title);
      const normalizedLocation = normalizeLocation(job.location);
      const normalizedDescription = normalizeText(job.description);
      const normalizedRequirements = normalizeText(job.requirements);

      // Deduplication strategy: URL is unique per user.
      // We also check company + title to avoid duplicates across different sources or slightly different URLs.
      const existingJob = await prisma.job.findFirst({
        where: {
          userId,
          OR: [
            { url: job.url },
            {
              company: { equals: normalizedCompany, mode: "insensitive" },
              title: { equals: normalizedTitle, mode: "insensitive" },
            },
          ],
        },
        select: { id: true },
      });

      if (!existingJob) {
        await prisma.job.create({
          data: {
            userId,
            source: job.source,
            sourceJobId: job.sourceJobId,
            company: normalizedCompany,
            title: normalizedTitle,
            location: normalizedLocation,
            url: job.url,
            description: normalizedDescription,
            requirements: normalizedRequirements,
            salaryMin: job.salaryMin,
            salaryMax: job.salaryMax,
            currency: job.currency,
            postedAt: job.postedAt,
            status: JobStatus.DISCOVERED,
          },
        });
        addedCount++;
      } else {
        // Update lastSeenAt
        await prisma.job.update({
          where: { id: existingJob.id },
          data: { lastSeenAt: new Date() },
        });
      }
    }

    // Update AutomationRun on success
    await prisma.automationRun.update({
      where: { id: automationRun.id },
      data: {
        status: AutomationStatus.SUCCEEDED,
        endedAt: new Date(),
        output: { jobsProcessed: rawJobs.length, jobsAdded: addedCount },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId,
        type: "JOB_INGESTED",
        message: `Ingested ${addedCount} new jobs from ${source}`,
        metadata: { source, jobsProcessed: rawJobs.length, jobsAdded: addedCount },
      },
    });

    return {
      source,
      success: true,
      jobsProcessed: rawJobs.length,
      jobsAdded: addedCount,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    // Update AutomationRun on failure
    await prisma.automationRun.update({
      where: { id: automationRun.id },
      data: {
        status: AutomationStatus.FAILED,
        endedAt: new Date(),
        error: errorMessage,
      },
    });

    return {
      source,
      success: false,
      jobsProcessed: 0,
      jobsAdded: 0,
      error: errorMessage,
    };
  }
}
