"use server";

import { revalidatePath } from "next/cache";
import { JobSource, JobStatus } from "@prisma/client";
import { getCurrentAppUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";
import { runJobIngestion } from "./service";
import { IngestionResult } from "./types";

export async function ingestJobsAction(
  source: JobSource,
  query?: string,
  company?: string
): Promise<IngestionResult> {
  const currentUser = await getCurrentAppUser();

  if (!currentUser.ok) {
    return {
      source,
      success: false,
      jobsProcessed: 0,
      jobsAdded: 0,
      error: currentUser.message,
    };
  }

  const result = await runJobIngestion(currentUser.user.id, source, query, company);
  revalidatePath("/jobs");
  return result;
}

export async function updateJobStatusAction(
  jobId: string,
  status: JobStatus
): Promise<{ ok: boolean; message: string }> {
  const currentUser = await getCurrentAppUser();

  if (!currentUser.ok) {
    return { ok: false, message: currentUser.message };
  }

  try {
    await prisma.job.updateMany({
      where: {
        id: jobId,
        userId: currentUser.user.id,
      },
      data: { status },
    });
    revalidatePath("/jobs");
    return { ok: true, message: "Job updated successfully" };
  } catch {
    return { ok: false, message: "Failed to update job" };
  }
}

export async function deleteJobAction(jobId: string): Promise<{ ok: boolean; message: string }> {
  const currentUser = await getCurrentAppUser();

  if (!currentUser.ok) {
    return { ok: false, message: currentUser.message };
  }

  try {
    await prisma.job.deleteMany({
      where: {
        id: jobId,
        userId: currentUser.user.id,
      },
    });
    revalidatePath("/jobs");
    return { ok: true, message: "Job deleted successfully" };
  } catch {
    return { ok: false, message: "Failed to delete job" };
  }
}
