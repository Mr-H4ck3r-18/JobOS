"use server";

import { revalidatePath } from "next/cache";
import { ResumeStatus } from "@prisma/client";

import { getCurrentAppUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";
import { parseResumeFile } from "@/features/resumes/parser";
import { buildResumeStoragePath, uploadResumeFile } from "@/features/resumes/storage";
import type { ResumeActionState } from "@/features/resumes/types";
import {
  resumeTextSchema,
  resumeUploadSchema,
  validateResumeFile,
} from "@/features/resumes/validation";

export async function uploadResumeAction(
  _previousState: ResumeActionState,
  formData: FormData,
): Promise<ResumeActionState> {
  const currentUser = await getCurrentAppUser();

  if (!currentUser.ok) {
    return { ok: false, message: currentUser.message };
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return { ok: false, message: "Choose a PDF or DOCX resume before uploading." };
  }

  const fileError = validateResumeFile(file);
  if (fileError) {
    return { ok: false, message: fileError };
  }

  const fields = resumeUploadSchema.safeParse({
    title: formData.get("title"),
    status: formData.get("status"),
    manualText: formData.get("manualText") || undefined,
  });

  if (!fields.success) {
    return { ok: false, message: fields.error.issues[0]?.message ?? "Resume details are invalid." };
  }

  const existingMaster = await prisma.resume.findFirst({
    where: {
      userId: currentUser.user.id,
      status: ResumeStatus.MASTER,
    },
    select: { id: true },
  });

  if (fields.data.status === ResumeStatus.MASTER && existingMaster) {
    return {
      ok: false,
      message: "A master resume already exists. Upload this as tailored or recruiter-specific.",
    };
  }

  const parsed = await parseResumeFile(file);
  const parsedText = parsed.text ?? fields.data.manualText ?? null;

  const resume = await prisma.resume.create({
    data: {
      userId: currentUser.user.id,
      title: fields.data.title,
      status: fields.data.status as ResumeStatus,
      originalFileName: file.name,
      contentType: file.type,
      parsedText,
      parseError: parsed.error,
      tags: [fields.data.status.toLowerCase().replace("_", "-")],
    },
    select: { id: true },
  });

  const storagePath = buildResumeStoragePath(currentUser.user.id, resume.id, file.name);

  try {
    await uploadResumeFile({ path: storagePath, file });

    await prisma.resume.update({
      where: { id: resume.id },
      data: { storagePath },
    });

    await prisma.activityLog.create({
      data: {
        userId: currentUser.user.id,
        type: "RESUME_UPLOADED",
        message: `${fields.data.title} uploaded as ${fields.data.status.toLowerCase().replace("_", " ")}.`,
        metadata: {
          resumeId: resume.id,
          fileName: file.name,
          parseStatus: parsed.error ? "needs-review" : "parsed",
        },
      },
    });
  } catch (error) {
    await prisma.resume.delete({ where: { id: resume.id } });

    return {
      ok: false,
      message: error instanceof Error ? error.message : "Resume upload failed.",
    };
  }

  revalidatePath("/resumes");

  return {
    ok: true,
    message: parsed.error
      ? "Resume uploaded. Parsing needs review, so add or edit the text manually."
      : "Resume uploaded and parsed.",
    resumeId: resume.id,
  };
}

export async function updateResumeTextAction(
  _previousState: ResumeActionState,
  formData: FormData,
): Promise<ResumeActionState> {
  const currentUser = await getCurrentAppUser();

  if (!currentUser.ok) {
    return { ok: false, message: currentUser.message };
  }

  const fields = resumeTextSchema.safeParse({
    resumeId: formData.get("resumeId"),
    parsedText: formData.get("parsedText"),
  });

  if (!fields.success) {
    return { ok: false, message: fields.error.issues[0]?.message ?? "Resume text is invalid." };
  }

  const updated = await prisma.resume.updateMany({
    where: {
      id: fields.data.resumeId,
      userId: currentUser.user.id,
    },
    data: {
      parsedText: fields.data.parsedText,
      parseError: null,
    },
  });

  if (updated.count === 0) {
    return { ok: false, message: "Resume not found." };
  }

  await prisma.activityLog.create({
    data: {
      userId: currentUser.user.id,
      type: "RESUME_UPLOADED",
      message: "Resume text updated.",
      metadata: {
        resumeId: fields.data.resumeId,
      },
    },
  });

  revalidatePath("/resumes");

  return {
    ok: true,
    message: "Resume text saved.",
    resumeId: fields.data.resumeId,
  };
}

export async function archiveResumeAction(resumeId: string): Promise<ResumeActionState> {
  const currentUser = await getCurrentAppUser();

  if (!currentUser.ok) {
    return { ok: false, message: currentUser.message };
  }

  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId: currentUser.user.id,
    },
    select: {
      id: true,
      title: true,
      status: true,
    },
  });

  if (!resume) {
    return { ok: false, message: "Resume not found." };
  }

  if (resume.status === ResumeStatus.MASTER) {
    return { ok: false, message: "The master resume is permanent and cannot be archived." };
  }

  await prisma.resume.update({
    where: { id: resume.id },
    data: { status: ResumeStatus.ARCHIVED },
  });

  await prisma.activityLog.create({
    data: {
      userId: currentUser.user.id,
      type: "RESUME_ARCHIVED",
      message: `${resume.title} archived.`,
      metadata: {
        resumeId: resume.id,
      },
    },
  });

  revalidatePath("/resumes");

  return {
    ok: true,
    message: "Resume archived.",
    resumeId,
  };
}
