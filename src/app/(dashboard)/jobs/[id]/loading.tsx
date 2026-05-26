import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function JobDetailLoading() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center h-10 w-10 rounded-md border border-border/40 bg-secondary/50">
          <ArrowLeft className="h-4 w-4 text-muted-foreground opacity-50" />
        </div>
        <div className="flex flex-col">
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      <Card className="border-border/50 bg-background/60 shadow-xl backdrop-blur-xl overflow-hidden relative">
        <CardHeader className="pb-4 relative z-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-10 w-3/4 max-w-md" />
              <Skeleton className="h-6 w-1/2 max-w-sm" />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Skeleton className="h-10 w-28 rounded-md" />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-border/50">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <Card className="border-border/50 bg-background/60 shadow-sm backdrop-blur-xl">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1 space-y-6">
          <Card className="border-border/50 bg-background/60 shadow-sm backdrop-blur-xl">
            <CardHeader>
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-4 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-32 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
