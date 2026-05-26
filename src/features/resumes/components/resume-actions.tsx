"use client";

import { cloneElement, isValidElement, useOptimistic, useTransition } from "react";
import type { ReactElement, ReactNode } from "react";
import { useRouter } from "next/navigation";

import { archiveResumeAction } from "@/features/resumes/actions";
import type { ResumeListItem } from "@/features/resumes/types";

type ArchiveResumeButtonProps = {
  resume: ResumeListItem;
  children: ReactNode;
};

export function ArchiveResumeButton({ resume, children }: ArchiveResumeButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isArchived, archiveOptimistically] = useOptimistic(false, () => true);
  const disabled = resume.status === "MASTER" || resume.status === "ARCHIVED" || isPending || isArchived;

  if (!isValidElement(children)) {
    return null;
  }

  return cloneElement(children as ReactElement<{ onClick?: () => void; disabled?: boolean }>, {
    disabled,
    onClick: () => {
      if (disabled) {
        return;
      }

      startTransition(async () => {
        archiveOptimistically(true);
        await archiveResumeAction(resume.id);
        router.refresh();
      });
    },
  });
}
