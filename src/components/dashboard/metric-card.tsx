import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  trend?: string | null;
  icon: LucideIcon;
};

export function MetricCard({ label, value, detail, trend, icon: Icon }: MetricCardProps) {
  return (
    <Card className="transition duration-200 hover:border-primary/40">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-muted-foreground">
            <Icon className="h-4 w-4" />
          </span>
          {trend && (
            <span className="rounded-md bg-accent/12 px-2 py-1 font-mono text-xs text-accent">
              {trend}
            </span>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
          <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
        </div>
      </CardContent>
    </Card>
  );
}
