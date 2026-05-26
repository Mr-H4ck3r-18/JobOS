import { JobSource } from "@prisma/client";
import { NormalizedJob, JobIngestionAdapter } from "../types";

export class GreenhouseAdapter implements JobIngestionAdapter {
  source = JobSource.GREENHOUSE;

  async ingest(_query?: string, company?: string): Promise<NormalizedJob[]> {
    if (!company) {
      console.warn("Greenhouse adapter requires a company name");
      return [];
    }

    try {
      // Greenhouse has a public board API
      const response = await fetch(`https://boards-api.greenhouse.io/v1/boards/${company}/jobs`);

      if (!response.ok) {
        throw new Error(`Greenhouse API returned ${response.status} for ${company}`);
      }

      const data = await response.json();
      
      if (!data.jobs || !Array.isArray(data.jobs)) {
        return [];
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.jobs.map((job: any) => ({
        source: this.source,
        sourceJobId: job.id?.toString() || `gh-${Date.now()}-${Math.random()}`,
        company: company, // Sometimes not in the job object itself
        title: job.title || "Unknown Title",
        location: job.location?.name || null,
        url: job.absolute_url || "",
        description: "", // Greenhouse usually requires fetching individual job endpoint for full description, keeping minimal for now to avoid rate limits
        requirements: null, 
        salaryMin: null,
        salaryMax: null,
        currency: null,
        postedAt: job.updated_at ? new Date(job.updated_at) : null,
      }));
    } catch (error) {
      console.error(`Greenhouse ingestion failed for ${company}:`, error);
      return [];
    }
  }
}
