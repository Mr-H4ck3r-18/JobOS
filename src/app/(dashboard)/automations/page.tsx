import { Metadata } from "next";
import { getCurrentAppUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";
import { AutomationsTable } from "@/features/automations/components/automations-table";

export const metadata: Metadata = {
  title: "Automations | JobOS",
  description: "View your job ingestion runs and automation histories.",
};

export default async function AutomationsPage() {
  const currentUser = await getCurrentAppUser();
  if (!currentUser.ok) return null;

  const runs = await prisma.automationRun.findMany({
    where: { userId: currentUser.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Automation Runs</h1>
        <p className="text-muted-foreground mt-1">Review ingestion logs and background jobs.</p>
      </div>

      <AutomationsTable runs={runs} />
    </div>
  );
}
