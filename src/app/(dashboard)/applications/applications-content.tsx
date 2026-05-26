import { prisma } from "@/lib/prisma";
import { ApplicationsTable } from "@/features/applications/components/applications-table";

export async function ApplicationsContent({ userId }: { userId: string }) {
  const applications = await prisma.application.findMany({
    where: { userId },
    select: {
      id: true,
      status: true,
      updatedAt: true,
      job: {
        select: { id: true, title: true, company: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return <ApplicationsTable applications={applications} />;
}
