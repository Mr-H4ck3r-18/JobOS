import { JobSource } from "@prisma/client";

export interface NormalizedJob {
  source: JobSource;
  sourceJobId: string;
  company: string;
  title: string;
  location: string | null;
  url: string;
  description: string;
  requirements: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string | null;
  postedAt: Date | null;
}

export interface JobIngestionAdapter {
  source: JobSource;
  ingest(query?: string, company?: string): Promise<NormalizedJob[]>;
}

export interface IngestionResult {
  source: JobSource;
  success: boolean;
  jobsProcessed: number;
  jobsAdded: number;
  error?: string;
}
