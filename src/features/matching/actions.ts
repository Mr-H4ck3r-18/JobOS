"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAppUser } from "@/lib/auth/current-user";
import { runJobMatch } from "./service";
import { DeterministicMatchResult } from "./types";

export async function generateJobMatchAction(jobId: string): Promise<{ ok: boolean; message: string; result?: DeterministicMatchResult }> {
  const currentUser = await getCurrentAppUser();

  if (!currentUser.ok) {
    return { ok: false, message: currentUser.message };
  }

  try {
    const result = await runJobMatch(currentUser.user.id, jobId);
    revalidatePath(`/jobs/${jobId}`);
    revalidatePath("/jobs"); // Update listing scores
    revalidatePath("/dashboard"); // Update top matches
    return { ok: true, message: "Match generated successfully", result };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to generate match";
    return { ok: false, message: msg };
  }
}
