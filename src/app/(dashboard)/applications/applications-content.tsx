import { prisma } from "@/lib/prisma";
import { ApplicationsTable } from "@/features/applications/components/applications-table";
import { getCurrentAppUser } from "@/lib/auth/current-user";
import { redirect } from "next/navigation";

export async function ApplicationsContent() {
  const currentUser = await getCurrentAppUser();
  if (!currentUser.ok) redirect("/login");
  const userId = currentUser.user.id;

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
