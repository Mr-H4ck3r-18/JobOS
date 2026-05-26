import { Suspense } from "react";
import { Metadata } from "next";
import { AutomationsContent } from "./automations-content";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Automations | JobOS",
  description: "Monitor background ingestion and matching tasks.",
};

export default function AutomationsPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Automations</h1>
        <p className="text-muted-foreground mt-1">Monitor background ingestion and matching tasks.</p>
      </div>

      <Card className="border-border/50 bg-background/60 shadow-xl backdrop-blur-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Recent Runs</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TableSkeleton rows={8} />}>
            <AutomationsContent />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
