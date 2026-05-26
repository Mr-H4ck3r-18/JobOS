import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import Link from "next/link";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel: string;
  actionHref?: string;
};

export function EmptyState({ title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
        <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-secondary text-primary">
          <Sparkles className="h-5 w-5" />
        </span>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>
        {actionHref ? (
          <Button asChild className="mt-6">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Link href={actionHref as any}>{actionLabel}</Link>
          </Button>
        ) : (
          <Button className="mt-6">{actionLabel}</Button>
        )}
      </CardContent>
    </Card>
  );
}
