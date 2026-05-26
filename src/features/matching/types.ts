export interface MatchSignals {
  keywordOverlapScore: number;
  roleSimilarityScore: number;
  experienceAlignmentScore: number;
  locationAlignmentScore: number;
}

export interface DeterministicMatchResult {
  score: number;
  strongSkills: string[];
  missingSkills: string[];
  signals: MatchSignals;
  explanation: string;
}

export interface MatchScoringWeights {
  keyword: number;
  role: number;
  experience: number;
  location: number;
}

export const DEFAULT_SCORING_WEIGHTS: MatchScoringWeights = {
  keyword: 0.4,
  role: 0.3,
  experience: 0.2,
  location: 0.1,
};
