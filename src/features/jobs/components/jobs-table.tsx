"use client";

import { useTransition } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Job, JobStatus } from "@prisma/client";
import { Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { updateJobStatusAction } from "../actions";

type JobWithMatch = Partial<Job> & { 
  id: string;
  title: string;
  company: string;
  location: string | null;
  status: JobStatus;
  source: string;
  postedAt: Date | null;
  url: string;
  matches?: { score: number }[] 
};

interface JobsTableProps {
  jobs: JobWithMatch[];
}

export function JobsTable({ jobs }: JobsTableProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggleSave = (jobId: string, currentStatus: JobStatus) => {
    startTransition(async () => {
      const newStatus = currentStatus === JobStatus.SAVED ? JobStatus.DISCOVERED : JobStatus.SAVED;
      await updateJobStatusAction(jobId, newStatus);
    });
  };

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-secondary p-3 mb-4">
          <Bot className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No jobs found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          Adjust your filters or trigger a sync to discover new opportunities.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-secondary/30">
          <TableRow>
            <TableHead>Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Match</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Posted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id} className="group">
              <TableCell className="font-medium">
                <Link href={`/jobs/${job.id}`} className="hover:underline hover:text-primary transition-colors">
                  {job.title}
                </Link>
                {job.status === JobStatus.SAVED && (
                  <Badge variant="secondary" className="ml-2 text-[10px] h-4 py-0">Saved</Badge>
                )}
              </TableCell>
              <TableCell>{job.company}</TableCell>
              <TableCell className="text-muted-foreground">{job.location || "Remote"}</TableCell>
              <TableCell>
                {job.matches && job.matches.length > 0 ? (
                  <Badge variant={job.matches[0].score >= 80 ? "default" : "secondary"} className="bg-primary/20 text-primary hover:bg-primary/30 border-transparent">
                    {job.matches[0].score}%
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs capitalize">
                  {job.source.toLowerCase().replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                {job.postedAt ? formatDistanceToNow(new Date(job.postedAt), { addSuffix: true }) : "Unknown"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleToggleSave(job.id, job.status)}
                    disabled={isPending}
                    title={job.status === JobStatus.SAVED ? "Unsave" : "Save"}
                  >
                    {job.status === JobStatus.SAVED ? (
                      <BookmarkCheck className="h-4 w-4 text-primary" />
                    ) : (
                      <Bookmark className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <a href={job.url} target="_blank" rel="noopener noreferrer" title="View original">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </a>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Temporary import for empty state
import { Bot } from "lucide-react";
