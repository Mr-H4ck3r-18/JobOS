import type { ResumeStatus } from "@prisma/client";

export type ResumeKind = Exclude<ResumeStatus, "ARCHIVED">;

export type ResumeListItem = {
  id: string;
  title: string;
  status: ResumeStatus;
  storagePath: string | null;
  originalFileName: string | null;
  contentType: string | null;
  parsedText: string | null;
  parseError: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  previewUrl: string | null;
};

export type ResumeActionState = {
  ok: boolean;
  message: string;
  resumeId?: string;
};

export const initialResumeActionState: ResumeActionState = {
  ok: false,
  message: "",
};
