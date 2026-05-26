import {
  Activity,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  MessageSquareText,
  TrendingUp,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/metric-card";
import { MatchTrendChart } from "@/components/dashboard/match-trend-chart";
import { StatusPipeline } from "@/components/dashboard/status-pipeline";
import { getCurrentAppUser } from "@/lib/auth/current-user";
import { getDashboardMetrics } from "@/features/dashboard/service";
import Link from "next/link";

export default async function DashboardPage() {
  const currentUser = await getCurrentAppUser();
  if (!currentUser.ok) return null;

  const data = await getDashboardMetrics(currentUser.user.id);

  const metrics = [
    {
      label: "Jobs found",
      value: data.metrics.totalJobs.toString(),
      detail: "Total aggregated",
      icon: BriefcaseBusiness,
      trend: null, // Removed fake trend
    },
    {
      label: "Jobs matched",
      value: data.metrics.matchedJobs.toString(),
      detail: "High relevance",
      icon: TrendingUp,
      trend: null,
    },
    {
      label: "Applications sent",
      value: data.metrics.totalApps.toString(),
      detail: "Manual submissions",
      icon: CheckCircle2,
      trend: null,
    },
    {
      label: "Interviews",
      value: data.metrics.interviews.toString(),
      detail: "Active pipelines",
      icon: MessageSquareText,
      trend: null,
    },
    {
      label: "Rejections",
      value: data.metrics.rejections.toString(),
      detail: "Closed applications",
      icon: XCircle,
      trend: null,
    },
  ];

  return (
    <main className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <Badge variant="secondary" className="w-fit">
            Career operating system
          </Badge>
          <div>
            <h1 className="text-3xl font-semibold tracking-normal text-foreground md:text-4xl">
              Prioritize the roles worth your attention.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Discover jobs, score them against your resume, prepare tailored drafts,
              and keep every application behind a manual approval step.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" asChild>
            <Link href="/resumes">
              <FileText className="h-4 w-4 mr-2" />
              Upload resume
            </Link>
          </Button>
          <Button asChild>
            <Link href="/jobs">
              <Bot className="h-4 w-4 mr-2" />
              Run job search
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
        <Card className="min-h-[360px]">
          <CardHeader>
            <CardTitle>Match Score Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Pass empty data for now to show empty state/onboarding */}
            <MatchTrendChart data={[]} />
          </CardContent>
        </Card>

        <Card className="min-h-[360px]">
          <CardHeader>
            <CardTitle>Status Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusPipeline pipeline={data.pipeline} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Top Matches</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.topMatches.length > 0 ? (
              data.topMatches.map((match) => (
                <Link
                  key={match.id}
                  href={`/jobs/${match.jobId}`}
                  className="flex items-center justify-between rounded-md border border-border/60 bg-secondary/40 px-3 py-3 transition-colors hover:bg-secondary/60"
                >
                  <div className="flex flex-col overflow-hidden pr-4">
                    <span className="text-sm font-medium truncate">{match.job.title}</span>
                    <span className="text-xs text-muted-foreground truncate">{match.job.company}</span>
                  </div>
                  <Badge variant={match.score >= 80 ? "default" : "secondary"} className="ml-2 shrink-0">
                    {match.score}%
                  </Badge>
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <FileText className="h-8 w-8 mb-3 opacity-20" />
                <p className="text-sm font-medium">No matches yet</p>
                <p className="text-xs max-w-[200px] mt-1">Upload your master resume and run a job search to generate matches.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentActivity.length > 0 ? (
                data.recentActivity.map((item) => (
                  <div key={item.id} className="rounded-md border border-border/60 bg-card px-3 py-3">
                    <p className="text-sm leading-6 text-muted-foreground">{item.message}</p>
                    <p className="text-xs text-muted-foreground/50 mt-1">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <Activity className="h-8 w-8 mb-3 opacity-20" />
                  <p className="text-sm font-medium">No activity yet</p>
                  <p className="text-xs mt-1">Your recent actions will appear here.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
