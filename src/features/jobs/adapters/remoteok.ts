import { JobSource } from "@prisma/client";
import { NormalizedJob, JobIngestionAdapter } from "../types";

export class RemoteOkAdapter implements JobIngestionAdapter {
  source = JobSource.REMOTE_OK;

  async ingest(query?: string): Promise<NormalizedJob[]> {
    try {
      // RemoteOK provides a public API
      const url = query 
        ? `https://remoteok.com/api?tags=${encodeURIComponent(query)}` 
        : `https://remoteok.com/api`;
        
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'JobOS-Ingestion/1.0',
        },
      });

      if (!response.ok) {
        throw new Error(`RemoteOK API returned ${response.status}`);
      }

      const data = await response.json();
      
      // First item is legal notice, skip it
      const jobs = Array.isArray(data) ? data.slice(1) : [];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return jobs.map((job: any) => ({
        source: this.source,
        sourceJobId: job.id?.toString() || `ro-${Date.now()}-${Math.random()}`,
        company: job.company || "Unknown Company",
        title: job.position || "Unknown Title",
        location: job.location || "Remote",
        url: job.url || "",
        description: job.description || "",
        requirements: null, // RemoteOK includes requirements in description usually
        salaryMin: job.salary_min || null,
        salaryMax: job.salary_max || null,
        currency: "USD",
        postedAt: job.date ? new Date(job.date) : null,
      }));
    } catch (error) {
      console.error("RemoteOK ingestion failed:", error);
      return [];
    }
  }
}
