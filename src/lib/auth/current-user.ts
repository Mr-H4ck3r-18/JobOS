import "server-only";

import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type CurrentAppUser =
  | {
      ok: true;
      user: {
        id: string;
        authUserId: string;
        email: string;
      };
    }
  | {
      ok: false;
      reason: "missing-env" | "unauthenticated";
      message: string;
    };

export async function getCurrentAppUser(): Promise<CurrentAppUser> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return {
      ok: false,
      reason: "missing-env",
      message: "Supabase environment variables are not configured yet.",
    };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return {
      ok: false,
      reason: "unauthenticated",
      message: "Sign in with Supabase Auth to manage resumes.",
    };
  }

  const appUser = await prisma.user.upsert({
    where: { authUserId: user.id },
    update: { email: user.email },
    create: {
      authUserId: user.id,
      email: user.email,
      fullName: user.user_metadata?.full_name ?? null,
    },
    select: {
      id: true,
      authUserId: true,
      email: true,
    },
  });

  return {
    ok: true,
    user: appUser,
  };
}
