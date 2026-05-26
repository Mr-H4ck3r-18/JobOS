"use client";

import { AutomationStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDistanceToNow } from "date-fns";

interface AutomationsTableProps {
  runs: {
    id: string;
    name: string;
    source: string | null;
    status: AutomationStatus;
    startedAt: Date | null;
    output: any;
    error: string | null;
  }[];
}

const statusColors: Record<AutomationStatus, string> = {
  QUEUED: "bg-muted text-muted-foreground",
  RUNNING: "bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse",
  SUCCEEDED: "bg-green-500/10 text-green-500 border-green-500/20",
  FAILED: "bg-red-500/10 text-red-500 border-red-500/20",
  CANCELLED: "bg-muted text-muted-foreground",
};

export function AutomationsTable({ runs }: AutomationsTableProps) {
  if (runs.length === 0) {
    return (
      <EmptyState
        title="No automation runs yet"
        description="Trigger your first job ingestion to see the logs here."
        actionLabel="Go to Jobs"
        actionHref="/jobs"
      />
    );
  }

  return (
    <div className="rounded-md border border-border/60 bg-card/60 backdrop-blur-xl">
      <Table>
        <TableHeader>
          <TableRow className="border-border/60">
            <TableHead>Run Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Details</TableHead>
            <TableHead className="text-right">Started</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {runs.map((run) => (
            <TableRow key={run.id} className="border-border/60">
              <TableCell className="font-medium">
                {run.name}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={statusColors[run.status]}>
                  {run.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                {run.status === "FAILED" ? (
                  <span className="text-red-400">{run.error || "Unknown error"}</span>
                ) : run.output ? (
                  <span>Processed: {run.output.jobsProcessed || 0}, Added: {run.output.jobsAdded || 0}</span>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="text-right text-muted-foreground text-sm">
                {run.startedAt ? formatDistanceToNow(new Date(run.startedAt), { addSuffix: true }) : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
