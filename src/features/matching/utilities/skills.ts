// Simplified standard tech list for deterministic extraction.
// A real production app would use an extensive taxonomy or NLP model.
const COMMON_TECH_SKILLS = new Set([
  "react", "javascript", "typescript", "node", "node.js", "python", "java", "c++", 
  "c#", "ruby", "go", "golang", "rust", "sql", "postgresql", "mysql", "mongodb",
  "aws", "gcp", "azure", "docker", "kubernetes", "graphql", "rest", "api", "html",
  "css", "tailwind", "next.js", "nextjs", "vue", "angular", "django", "flask", "spring",
  "kafka", "redis", "elasticsearch", "ci/cd", "git", "linux", "agile", "scrum"
]);

export function extractSkills(text: string): string[] {
  if (!text) return [];
  const normalizedText = text.toLowerCase();
  // Basic regex to find alpha-numeric words including some punctuation like . or +
  const words = normalizedText.match(/\b[a-z0-9+#.]+\b/g) || [];
  
  const extracted = new Set<string>();
  
  for (const word of words) {
    if (COMMON_TECH_SKILLS.has(word)) {
      extracted.add(word);
    }
  }

  // Also check for compound words explicitly if they exist in text
  for (const skill of COMMON_TECH_SKILLS) {
    if (skill.includes(" ") || skill.includes("/")) {
      if (normalizedText.includes(skill)) {
        extracted.add(skill);
      }
    }
  }

  return Array.from(extracted);
}

export function compareSkills(resumeSkills: string[], jobSkills: string[]) {
  const resumeSet = new Set(resumeSkills.map(s => s.toLowerCase()));
  const jobSet = new Set(jobSkills.map(s => s.toLowerCase()));

  const strongSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const skill of jobSet) {
    if (resumeSet.has(skill)) {
      strongSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  const keywordOverlapScore = jobSet.size > 0 
    ? (strongSkills.length / jobSet.size) * 100 
    : 100; // If job requires no specific known tech, it's not a mismatch

  return { strongSkills, missingSkills, keywordOverlapScore };
}
