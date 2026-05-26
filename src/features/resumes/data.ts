import "server-only";

import { prisma } from "@/lib/prisma";
import { getCurrentAppUser } from "@/lib/auth/current-user";
import { createResumeSignedUrl } from "@/features/resumes/storage";
import type { ResumeListItem } from "@/features/resumes/types";

export async function getResumePageData() {
  const currentUser = await getCurrentAppUser();

  if (!currentUser.ok) {
    return {
      currentUser,
      resumes: [] satisfies ResumeListItem[],
    };
  }

  const resumes = await prisma.resume.findMany({
    where: {
      userId: currentUser.user.id,
    },
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
  });

  return {
    currentUser,
    resumes: await Promise.all(
      resumes.map(async (resume) => ({
        id: resume.id,
        title: resume.title,
        status: resume.status,
        storagePath: resume.storagePath,
        originalFileName: resume.originalFileName,
        contentType: resume.contentType,
        parsedText: resume.parsedText,
        parseError: resume.parseError,
        tags: resume.tags,
        createdAt: resume.createdAt.toISOString(),
        updatedAt: resume.updatedAt.toISOString(),
        previewUrl: await createResumeSignedUrl(resume.storagePath),
      })),
    ),
  };
}
