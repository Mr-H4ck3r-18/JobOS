import { Suspense } from "react";
import { Metadata } from "next";
import { getCurrentAppUser } from "@/lib/auth/current-user";
import { ApplicationsContent } from "./applications-content";
import { TableSkeleton } from "@/components/ui/table-skeleton";

export const metadata: Metadata = {
  title: "Applications | JobOS",
  description: "Track your job applications.",
};

export default async function ApplicationsPage() {
  const currentUser = await getCurrentAppUser();
  if (!currentUser.ok) return null;

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground mt-1">Track drafts, reviews, submissions, and interviews.</p>
      </div>

      <Suspense fallback={<TableSkeleton rows={5} />}>
        <ApplicationsContent userId={currentUser.user.id} />
      </Suspense>
    </div>
  );
}
