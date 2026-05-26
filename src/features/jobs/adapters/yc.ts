import { JobSource } from "@prisma/client";
import { NormalizedJob, JobIngestionAdapter } from "../types";

export class YcJobsAdapter implements JobIngestionAdapter {
  source = JobSource.YC_JOBS;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ingest(_query?: string): Promise<NormalizedJob[]> {
    // YC Jobs doesn't have a stable public unauthenticated JSON API that is easy to consume without a session.
    // Following guidelines: "Avoid scraping complexity initially", "Prefer stable APIs".
    // We will simulate the adapter here returning an empty array or gracefully failing.
    // In a real implementation, this would use Puppeteer/Playwright or an unofficial API endpoint.
    console.warn("YC Jobs ingestion requires complex scraping which is disabled initially.");
    return [];
  }
}
