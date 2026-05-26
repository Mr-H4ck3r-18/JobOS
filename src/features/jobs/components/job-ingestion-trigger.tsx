"use client";

import { useTransition } from "react";
import { JobSource } from "@prisma/client";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ingestJobsAction } from "../actions";

export function JobIngestionTrigger() {
  const [isPending, startTransition] = useTransition();

  const handleIngest = async (source: JobSource) => {
    startTransition(async () => {
      // For now we just trigger RemoteOK or a dummy ingestion
      // In a real app, this would open a modal to select source and enter company/query
      await ingestJobsAction(source, "react"); // Hardcoded "react" for demonstration
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => handleIngest(JobSource.REMOTE_OK)}
        disabled={isPending}
        className="bg-background/50 backdrop-blur-md"
      >
        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
        Sync RemoteOK
      </Button>
      {/* Could add other sources here, but since Lever/GH need company names, 
          they usually require a form. Keeping it simple as requested. */}
    </div>
  );
}
