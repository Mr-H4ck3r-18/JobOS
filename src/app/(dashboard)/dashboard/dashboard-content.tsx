import { Activity, BriefcaseBusiness, CheckCircle2, FileText, MessageSquareText, TrendingUp, XCircle } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/metric-card";
import { MatchTrendChart } from "@/components/dashboard/match-trend-chart-wrapper";
import { StatusPipeline } from "@/components/dashboard/status-pipeline";
import { getDashboardMetrics } from "@/features/dashboard/service";
import { StaggeredGrid } from "@/components/ui/staggered-grid";

export async function DashboardContent({ userId }: { userId: string }) {
  const data = await getDashboardMetrics(userId);

  const metrics = [
    {
      label: "Jobs found",
      value: data.metrics.totalJobs.toString(),
      detail: "Total aggregated",
      icon: BriefcaseBusiness,
      trend: null,
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
    <>
      <StaggeredGrid className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </StaggeredGrid>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
        <Card className="min-h-[360px]">
          <CardHeader>
            <CardTitle>Match Score Trends</CardTitle>
          </CardHeader>
          <CardContent>
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
                  className="group flex items-center justify-between rounded-md border border-border/60 bg-secondary/40 px-3 py-3 transition-all duration-200 hover:bg-secondary/60 hover:border-border/80"
                >
                  <div className="flex flex-col overflow-hidden pr-4">
                    <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">{match.job.title}</span>
                    <span className="text-xs text-muted-foreground truncate">{match.job.company}</span>
                  </div>
                  <Badge variant={match.score >= 80 ? "default" : "secondary"} className="ml-2 shrink-0 transition-transform group-hover:scale-105">
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
                  <div key={item.id} className="rounded-md border border-border/60 bg-card px-3 py-3 transition-colors hover:border-border/80">
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
    </>
  );
}
