"use client";

import { useTransition, useState } from "react";
import { Loader2, CheckCircle2, XCircle, BarChart3, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generateJobMatchAction } from "../actions";

interface MatchInsightCardProps {
  jobId: string;
  initialMatch?: {
    score: number;
    explanation: string;
    strongSkills: string[];
    missingSkills: string[];
  } | null;
}

export function MatchInsightCard({ jobId, initialMatch }: MatchInsightCardProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleRunMatch = () => {
    setError(null);
    startTransition(async () => {
      const result = await generateJobMatchAction(jobId);
      if (!result.ok) {
        setError(result.message);
      }
    });
  };

  if (!initialMatch) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <p className="text-sm text-muted-foreground mb-4">Job matching hasn&apos;t been run for this role yet.</p>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={handleRunMatch}
          disabled={isPending}
        >
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BarChart3 className="mr-2 h-4 w-4" />}
          Analyze Match
        </Button>
        {error && <p className="text-xs text-destructive mt-3 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center">
        <div className="relative inline-flex items-center justify-center mb-4">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle cx="48" cy="48" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/30" />
            <circle 
              cx="48" cy="48" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" 
              strokeDasharray={2 * Math.PI * 36}
              strokeDashoffset={(2 * Math.PI * 36) * (1 - initialMatch.score / 100)}
              className={
                initialMatch.score >= 80 ? "text-green-500" :
                initialMatch.score >= 50 ? "text-yellow-500" :
                "text-red-500"
              }
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-bold">{initialMatch.score}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{initialMatch.explanation}</p>
        <Button 
          variant="secondary" 
          size="sm" 
          className="mt-4 text-xs h-7"
          onClick={handleRunMatch}
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
          Recalculate
        </Button>
      </div>

      {(initialMatch.strongSkills.length > 0 || initialMatch.missingSkills.length > 0) && (
        <div className="space-y-4 pt-4 border-t border-border/50">
          {initialMatch.strongSkills.length > 0 && (
            <div>
              <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" /> Matched Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {initialMatch.strongSkills.map(s => (
                  <Badge key={s} variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">{s}</Badge>
                ))}
              </div>
            </div>
          )}
          
          {initialMatch.missingSkills.length > 0 && (
            <div>
              <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                <XCircle className="h-4 w-4 text-red-500" /> Missing Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {initialMatch.missingSkills.map(s => (
                  <Badge key={s} variant="secondary" className="bg-red-500/10 text-red-500 hover:bg-red-500/20">{s}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
