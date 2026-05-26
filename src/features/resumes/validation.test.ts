import { describe, expect, it } from "vitest";

import { MAX_RESUME_SIZE_BYTES, resumeUploadSchema, validateResumeFile } from "./validation";

describe("resume validation", () => {
  it("accepts PDF uploads inside the size limit", () => {
    const file = new File(["resume"], "resume.pdf", { type: "application/pdf" });

    expect(validateResumeFile(file)).toBeNull();
  });

  it("accepts DOCX uploads inside the size limit", () => {
    const file = new File(["resume"], "resume.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    expect(validateResumeFile(file)).toBeNull();
  });

  it("rejects unsupported file types", () => {
    const file = new File(["resume"], "resume.txt", { type: "text/plain" });

    expect(validateResumeFile(file)).toContain("Only PDF and DOCX");
  });

  it("rejects oversized files", () => {
    const file = new File([new Uint8Array(MAX_RESUME_SIZE_BYTES + 1)], "resume.pdf", {
      type: "application/pdf",
    });

    expect(validateResumeFile(file)).toContain("8 MB");
  });

  it("validates supported resume version types", () => {
    const result = resumeUploadSchema.safeParse({
      title: "Recruiter version",
      status: "RECRUITER_SPECIFIC",
      manualText: "Experienced software engineer",
    });

    expect(result.success).toBe(true);
  });
});
