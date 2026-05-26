"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

export const MatchTrendChart = dynamic(
  () => import("./match-trend-chart").then((m) => m.MatchTrendChart),
  { ssr: false, loading: () => <Skeleton className="h-[280px] w-full" /> }
);
