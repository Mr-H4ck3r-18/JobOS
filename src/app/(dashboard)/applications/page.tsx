import { Suspense } from "react";
import { Metadata } from "next";
import { ApplicationsContent } from "./applications-content";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Applications | JobOS",
  description: "Track your job applications and interview pipeline.",
};

export default function ApplicationsPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground mt-1">Track your job applications and interview pipeline.</p>
        </div>
        <Button asChild>
          <Link href="/jobs">
            <Send className="mr-2 h-4 w-4" />
            Find jobs to apply
          </Link>
        </Button>
      </div>

      <Card className="border-border/50 bg-background/60 shadow-xl backdrop-blur-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Application Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TableSkeleton rows={8} />}>
            <ApplicationsContent />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
