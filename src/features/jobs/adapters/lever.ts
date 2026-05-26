import { JobSource } from "@prisma/client";
import { NormalizedJob, JobIngestionAdapter } from "../types";

export class LeverAdapter implements JobIngestionAdapter {
  source = JobSource.LEVER;

  async ingest(_query?: string, company?: string): Promise<NormalizedJob[]> {
    if (!company) {
      console.warn("Lever adapter requires a company name");
      return [];
    }

    try {
      // Lever public API
      const response = await fetch(`https://api.lever.co/v0/postings/${company}`);

      if (!response.ok) {
        throw new Error(`Lever API returned ${response.status} for ${company}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        return [];
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.map((job: any) => ({
        source: this.source,
        sourceJobId: job.id?.toString() || `lv-${Date.now()}-${Math.random()}`,
        company: company,
        title: job.text || "Unknown Title",
        location: job.categories?.location || null,
        url: job.hostedUrl || "",
        description: job.descriptionPlain || "", 
        requirements: job.lists ? JSON.stringify(job.lists) : null,
        salaryMin: null,
        salaryMax: null,
        currency: null,
        postedAt: job.createdAt ? new Date(job.createdAt) : null,
      }));
    } catch (error) {
      console.error(`Lever ingestion failed for ${company}:`, error);
      return [];
    }
  }
}
