"use client";

import { ApplicationStatus } from "@prisma/client";
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
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface ApplicationsTableProps {
  applications: {
    id: string;
    status: ApplicationStatus;
    updatedAt: Date;
    job: {
      id: string;
      title: string;
      company: string;
    };
  }[];
}

const statusColors: Record<ApplicationStatus, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  NEEDS_REVIEW: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  APPROVED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  APPLIED: "bg-green-500/10 text-green-500 border-green-500/20",
  INTERVIEWING: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  OFFER: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
  WITHDRAWN: "bg-muted text-muted-foreground",
};

export function ApplicationsTable({ applications }: ApplicationsTableProps) {
  if (applications.length === 0) {
    return (
      <EmptyState
        title="No applications yet"
        description="When you apply or approve a job from your matches, it will appear here."
        actionLabel="Find Jobs"
        actionHref="/jobs"
      />
    );
  }

  return (
    <div className="rounded-md border border-border/60 bg-card/60 backdrop-blur-xl">
      <Table>
        <TableHeader>
          <TableRow className="border-border/60">
            <TableHead>Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => (
            <TableRow key={app.id} className="border-border/60">
              <TableCell className="font-medium">
                <Link href={`/jobs/${app.job.id}`} className="hover:underline">
                  {app.job.title}
                </Link>
              </TableCell>
              <TableCell>{app.job.company}</TableCell>
              <TableCell>
                <Badge variant="outline" className={statusColors[app.status]}>
                  {app.status.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell className="text-right text-muted-foreground text-sm">
                {formatDistanceToNow(new Date(app.updatedAt), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
