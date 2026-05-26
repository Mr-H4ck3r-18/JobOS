import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Building2, Calendar, DollarSign, ExternalLink, Globe2 } from "lucide-react";

import { JobStatus } from "@prisma/client";
import { getCurrentAppUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchInsightCard } from "@/features/matching/components/match-insight-card";

export const metadata: Metadata = {
  title: "Job Details | JobOS",
};

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const currentUser = await getCurrentAppUser();
  if (!currentUser.ok) return null;

  const resolvedParams = await params;

  const job = await prisma.job.findUnique({
    where: {
      id: resolvedParams.id,
      userId: currentUser.user.id,
    },
    include: {
      matches: {
        where: { userId: currentUser.user.id },
        take: 1,
      },
    },
  });

  if (!job) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/jobs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex flex-col">
          <p className="text-sm text-muted-foreground">Back to jobs</p>
        </div>
      </div>

      <Card className="border-border/50 bg-background/60 shadow-xl backdrop-blur-xl overflow-hidden relative">
        {/* Abstract background flourish */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        
        <CardHeader className="pb-4 relative z-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={job.status === JobStatus.SAVED ? "default" : "secondary"}>
                  {job.status}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {job.source.toLowerCase().replace("_", " ")}
                </Badge>
                {job.postedAt && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}
                  </span>
                )}
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight">{job.title}</CardTitle>
              <CardDescription className="text-lg flex items-center gap-2 text-foreground/80">
                <Building2 className="h-4 w-4" /> {job.company}
              </CardDescription>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button asChild>
                <a href={job.url} target="_blank" rel="noopener noreferrer">
                  Apply <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe2 className="h-4 w-4" />
              <span>{job.location || "Remote"}</span>
            </div>
            
            {(job.salaryMin || job.salaryMax) && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>
                  {job.salaryMin ? `${job.salaryMin.toLocaleString()}` : ""}
                  {job.salaryMin && job.salaryMax ? " - " : ""}
                  {job.salaryMax ? `${job.salaryMax.toLocaleString()}` : ""}
                  {job.currency ? ` ${job.currency}` : ""}
                </span>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <Card className="border-border/50 bg-background/60 shadow-sm backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
              {job.description ? (
                <div 
                  className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-secondary/50 prose-a:text-primary whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              ) : (
                <p className="text-muted-foreground italic">No detailed description available. Click &apos;Apply&apos; to view the full job posting.</p>
              )}
            </CardContent>
          </Card>

          {job.requirements && (
            <Card className="border-border/50 bg-background/60 shadow-sm backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg">Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: job.requirements }}
                />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="col-span-1 space-y-6">
          <Card className="border-border/50 bg-background/60 shadow-sm backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg">Insights</CardTitle>
              <CardDescription>AI-generated match and notes</CardDescription>
            </CardHeader>
            <CardContent>
              <MatchInsightCard jobId={job.id} initialMatch={job.matches[0]} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
