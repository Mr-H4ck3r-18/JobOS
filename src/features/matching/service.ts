import { ResumeStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { calculateDeterministicMatch } from "./utilities/scoring";
import { DeterministicMatchResult } from "./types";

export async function runJobMatch(userId: string, jobId: string): Promise<DeterministicMatchResult> {
  const [job, user, masterResume] = await Promise.all([
    prisma.job.findUnique({ where: { id: jobId, userId } }),
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.resume.findFirst({
      where: { userId, status: ResumeStatus.MASTER },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!job) throw new Error("Job not found");
  if (!user) throw new Error("User not found");
  if (!masterResume) throw new Error("No master resume found for matching");

  const fullJobDescription = [job.description, job.requirements].filter(Boolean).join(" ");
  
  // Optional AI Check could be injected here in the future
  // if (featureFlags.enableLLMMatching) { return runAIMatch(...) }

  const matchResult = calculateDeterministicMatch(
    masterResume.title,
    masterResume.parsedText || "",
    user.targetLocations,
    job.title,
    fullJobDescription,
    job.location
  );

  // Upsert the match into the database
  await prisma.jobMatch.upsert({
    where: {
      jobId_resumeId: {
        jobId: job.id,
        resumeId: masterResume.id,
      },
    },
    update: {
      score: matchResult.score,
      explanation: matchResult.explanation,
      strongSkills: matchResult.strongSkills,
      missingSkills: matchResult.missingSkills,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rawSignals: matchResult.signals as any, // Store deterministic signals
    },
    create: {
      userId,
      jobId: job.id,
      resumeId: masterResume.id,
      score: matchResult.score,
      explanation: matchResult.explanation,
      strongSkills: matchResult.strongSkills,
      missingSkills: matchResult.missingSkills,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rawSignals: matchResult.signals as any,
    },
  });

  // Log activity
  await prisma.activityLog.create({
    data: {
      userId,
      type: "JOB_MATCHED",
      message: `Generated match score of ${matchResult.score}% for ${job.title} at ${job.company}`,
      metadata: { jobId: job.id, score: matchResult.score },
    },
  });

  return matchResult;
}
