import { Suspense } from "react";
import { Metadata } from "next";
import { getCurrentAppUser } from "@/lib/auth/current-user";
import { AutomationsContent } from "./automations-content";
import { TableSkeleton } from "@/components/ui/table-skeleton";

export const metadata: Metadata = {
  title: "Automations | JobOS",
  description: "View your job ingestion runs and automation histories.",
};

export default async function AutomationsPage() {
  const currentUser = await getCurrentAppUser();
  if (!currentUser.ok) return null;

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Automation Runs</h1>
        <p className="text-muted-foreground mt-1">Review ingestion logs and background jobs.</p>
      </div>

      <Suspense fallback={<TableSkeleton rows={5} />}>
        <AutomationsContent userId={currentUser.user.id} />
      </Suspense>
    </div>
  );
}
