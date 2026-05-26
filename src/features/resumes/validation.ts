import { z } from "zod";

export const MAX_RESUME_SIZE_BYTES = 8 * 1024 * 1024;

export const allowedResumeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const resumeKindSchema = z.enum(["MASTER", "TAILORED", "RECRUITER_SPECIFIC"]);

export const resumeUploadSchema = z.object({
  title: z.string().trim().min(2, "Add a title with at least 2 characters.").max(120),
  status: resumeKindSchema,
  manualText: z.string().trim().max(120_000).optional(),
});

export const resumeTextSchema = z.object({
  resumeId: z.string().min(1),
  parsedText: z.string().trim().min(20, "Resume text should be at least 20 characters.").max(120_000),
});

export function validateResumeFile(file: File) {
  if (file.size === 0) {
    return "Choose a PDF or DOCX resume before uploading.";
  }

  if (file.size > MAX_RESUME_SIZE_BYTES) {
    return "Resume files must be 8 MB or smaller.";
  }

  if (!allowedResumeTypes.includes(file.type as (typeof allowedResumeTypes)[number])) {
    return "Only PDF and DOCX resumes are supported.";
  }

  return null;
}
