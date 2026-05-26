"use client";

import { FileText } from "lucide-react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MatchTrendChartProps {
  data: { week: string; score: number }[];
}

export function MatchTrendChart({ data }: MatchTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[280px] w-full flex-col items-center justify-center text-center">
        <FileText className="h-10 w-10 mb-4 opacity-20 text-muted-foreground" />
        <h3 className="text-sm font-medium text-foreground">No trends to display</h3>
        <p className="text-xs text-muted-foreground mt-2 max-w-[250px]">
          Upload your master resume and run a job scan to start tracking your match score trends over time.
        </p>
        <Link href="/resumes" className="mt-4 text-xs font-medium text-primary hover:underline">
          Upload Master Resume
        </Link>
      </div>
    );
  }

  return (
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="matchScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.695 0.15 251)" stopOpacity={0.28} />
              <stop offset="95%" stopColor="oklch(0.695 0.15 251)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="oklch(0.322 0.018 264 / 0.5)" vertical={false} />
          <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fill: "oklch(0.705 0.018 262)", fontSize: 12 }} />
          <YAxis domain={[50, 100]} tickLine={false} axisLine={false} tick={{ fill: "oklch(0.705 0.018 262)", fontSize: 12 }} />
          <Tooltip
            cursor={{ stroke: "oklch(0.695 0.15 251 / 0.45)" }}
            contentStyle={{
              background: "oklch(0.225 0.014 264)",
              border: "1px solid oklch(0.322 0.018 264)",
              borderRadius: 8,
              color: "oklch(0.945 0.01 260)",
            }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="oklch(0.695 0.15 251)"
            strokeWidth={2}
            fill="url(#matchScore)"
            isAnimationActive
            animationDuration={240}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
