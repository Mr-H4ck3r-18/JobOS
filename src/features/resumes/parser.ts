import "server-only";

export type ResumeParseResult = {
  text: string | null;
  error: string | null;
};

export async function parseResumeFile(file: File): Promise<ResumeParseResult> {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    if (file.type === "application/pdf") {
      return parsePdf(buffer);
    }

    if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      return parseDocx(buffer);
    }

    return {
      text: null,
      error: "Unsupported resume file type.",
    };
  } catch (error) {
    return {
      text: null,
      error: error instanceof Error ? error.message : "Resume parsing failed.",
    };
  }
}

async function parsePdf(buffer: Buffer): Promise<ResumeParseResult> {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  await parser.destroy();
  const text = normalizeParsedText(result.text);

  return text
    ? { text, error: null }
    : { text: null, error: "The PDF uploaded, but no selectable text was found." };
}

async function parseDocx(buffer: Buffer): Promise<ResumeParseResult> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  const text = normalizeParsedText(result.value);
  const warnings = result.messages.map((message) => message.message).filter(Boolean);

  return {
    text,
    error: text ? warnings[0] ?? null : "The DOCX uploaded, but no text could be extracted.",
  };
}

function normalizeParsedText(value: string | undefined) {
  const text = value
    ?.replace(/\r/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return text && text.length > 0 ? text : null;
}
