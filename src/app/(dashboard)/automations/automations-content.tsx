import { prisma } from "@/lib/prisma";
import { AutomationsTable } from "@/features/automations/components/automations-table";

export async function AutomationsContent({ userId }: { userId: string }) {
  const runs = await prisma.automationRun.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      source: true,
      status: true,
      startedAt: true,
      output: true,
      error: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return <AutomationsTable runs={runs} />;
}
