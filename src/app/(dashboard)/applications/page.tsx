import { Metadata } from "next";
import { getCurrentAppUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";
import { ApplicationsTable } from "@/features/applications/components/applications-table";

export const metadata: Metadata = {
  title: "Applications | JobOS",
  description: "Track your job applications.",
};

export default async function ApplicationsPage() {
  const currentUser = await getCurrentAppUser();
  if (!currentUser.ok) return null;

  const applications = await prisma.application.findMany({
    where: { userId: currentUser.user.id },
    include: {
      job: {
        select: { id: true, title: true, company: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground mt-1">Track drafts, reviews, submissions, and interviews.</p>
      </div>

      <ApplicationsTable applications={applications} />
    </div>
  );
}
