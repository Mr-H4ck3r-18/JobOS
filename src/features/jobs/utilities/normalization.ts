export function normalizeText(text: string | null | undefined): string {
  if (!text) return "";
  
  return text
    // Remove HTML entities like &amp; &nbsp;
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    // Remove excessive whitespace
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeLocation(location: string | null | undefined): string | null {
  if (!location) return null;
  
  const clean = normalizeText(location);
  const lower = clean.toLowerCase();
  
  // Standardize remote locations
  if (lower.includes("remote") || lower === "anywhere") {
    return "Remote";
  }
  
  return clean || null;
}

export function normalizeJobTitle(title: string | null | undefined): string {
  if (!title) return "Unknown Title";
  return normalizeText(title);
}

export function normalizeCompanyName(company: string | null | undefined): string {
  if (!company) return "Unknown Company";
  return normalizeText(company);
}
