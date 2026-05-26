"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function JobFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      // Reset page when filtering
      params.delete("page");
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Basic debounce could be added here, but keeping it simple for now
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push((pathname + "?" + createQueryString("q", e.target.value)) as any);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search jobs by title, company..."
          className="pl-9 bg-background/50 border-border/50"
          defaultValue={searchParams.get("q") ?? ""}
          onChange={handleSearch}
        />
      </div>
      <div className="flex gap-2">
        {/* We can add a custom Select component here if we have one, or just simple native selects */}
        <select
          className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={searchParams.get("status") ?? ""}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange={(e) => router.push((pathname + "?" + createQueryString("status", e.target.value)) as any)}
        >
          <option value="">All Statuses</option>
          <option value="DISCOVERED">Discovered</option>
          <option value="SAVED">Saved</option>
          <option value="HIDDEN">Hidden</option>
        </select>

        <select
          className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={searchParams.get("source") ?? ""}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange={(e) => router.push((pathname + "?" + createQueryString("source", e.target.value)) as any)}
        >
          <option value="">All Sources</option>
          <option value="REMOTE_OK">RemoteOK</option>
          <option value="GREENHOUSE">Greenhouse</option>
          <option value="LEVER">Lever</option>
          <option value="YC_JOBS">YC Jobs</option>
        </select>
      </div>
    </div>
  );
}
