import { prisma } from "@/lib/prisma";
import { AutomationsTable } from "@/features/automations/components/automations-table";
import { getCurrentAppUser } from "@/lib/auth/current-user";
import { redirect } from "next/navigation";

export async function AutomationsContent() {
  const currentUser = await getCurrentAppUser();
  if (!currentUser.ok) redirect("/login");
  const userId = currentUser.user.id;

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
