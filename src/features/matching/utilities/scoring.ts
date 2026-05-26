import { DeterministicMatchResult, DEFAULT_SCORING_WEIGHTS, MatchScoringWeights } from "../types";
import { extractSkills, compareSkills } from "./skills";

export function evaluateRoleSimilarity(resumeTitle: string, jobTitle: string): number {
  if (!resumeTitle || !jobTitle) return 50;
  const t1 = resumeTitle.toLowerCase();
  const t2 = jobTitle.toLowerCase();
  
  if (t1 === t2) return 100;
  if (t1.includes(t2) || t2.includes(t1)) return 80;
  
  // Basic substring split check
  const words1 = t1.split(/\s+/);
  const words2 = new Set(t2.split(/\s+/));
  const overlap = words1.filter(w => words2.has(w)).length;
  
  if (overlap > 0) return Math.min(100, 40 + (overlap * 20));
  return 30; // Very basic heuristic
}

export function evaluateExperienceAlignment(resumeText: string, jobText: string): number {
  // Very crude deterministic heuristic: count occurrences of "years" or "senior"
  // A real robust deterministic app might use regex for "X+ years"
  const isJobSenior = jobText.toLowerCase().includes("senior") || jobText.toLowerCase().includes("lead");
  const isResumeSenior = resumeText.toLowerCase().includes("senior") || resumeText.toLowerCase().includes("lead");
  
  if (isJobSenior === isResumeSenior) return 100;
  if (isResumeSenior && !isJobSenior) return 80; // Overqualified, but capable
  return 40; // Underqualified likely
}

export function evaluateLocationAlignment(userLocations: string[], jobLocation: string | null): number {
  if (!jobLocation) return 100; // Assume remote/any if not specified
  const normalizedJobLoc = jobLocation.toLowerCase();
  
  if (normalizedJobLoc.includes("remote")) return 100;
  
  if (userLocations.length === 0) return 80; // User didn't specify, maybe open to relocate
  
  for (const loc of userLocations) {
    if (normalizedJobLoc.includes(loc.toLowerCase())) {
      return 100;
    }
  }
  
  return 20; // Mismatch
}

export function calculateDeterministicMatch(
  resumeTitle: string,
  resumeText: string,
  userLocations: string[],
  jobTitle: string,
  jobDescription: string,
  jobLocation: string | null,
  weights: MatchScoringWeights = DEFAULT_SCORING_WEIGHTS
): DeterministicMatchResult {
  
  // 1. Keyword extraction & comparison
  const resumeSkills = extractSkills(resumeText);
  const jobSkills = extractSkills(jobDescription);
  
  const { strongSkills, missingSkills, keywordOverlapScore } = compareSkills(resumeSkills, jobSkills);
  
  // 2. Role similarity
  const roleSimilarityScore = evaluateRoleSimilarity(resumeTitle, jobTitle);
  
  // 3. Experience alignment
  const experienceAlignmentScore = evaluateExperienceAlignment(resumeText, jobDescription);
  
  // 4. Location alignment
  const locationAlignmentScore = evaluateLocationAlignment(userLocations, jobLocation);
  
  // 5. Final weighted score
  const score = Math.round(
    (keywordOverlapScore * weights.keyword) +
    (roleSimilarityScore * weights.role) +
    (experienceAlignmentScore * weights.experience) +
    (locationAlignmentScore * weights.location)
  );

  let explanation = `Match score is ${score}%. `;
  if (strongSkills.length > 0) {
    explanation += `Strong alignment on ${strongSkills.slice(0, 3).join(", ")}. `;
  }
  if (missingSkills.length > 0) {
    explanation += `Consider highlighting experience with ${missingSkills.slice(0, 2).join(", ")} if possible.`;
  }
  if (locationAlignmentScore < 50) {
    explanation += ` Note: Location may not align perfectly.`;
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    strongSkills,
    missingSkills,
    signals: {
      keywordOverlapScore,
      roleSimilarityScore,
      experienceAlignmentScore,
      locationAlignmentScore,
    },
    explanation,
  };
}
