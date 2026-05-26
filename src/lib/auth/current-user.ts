import "server-only";

import { cache } from "react";
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

export const getCurrentAppUser = cache(async (): Promise<CurrentAppUser> => {
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

  let appUser = await prisma.user.findUnique({
    where: { authUserId: user.id },
    select: {
      id: true,
      authUserId: true,
      email: true,
    },
  });

  if (!appUser) {
    appUser = await prisma.user.create({
      data: {
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
  } else if (appUser.email !== user.email) {
    // Only update if email changed
    appUser = await prisma.user.update({
      where: { authUserId: user.id },
      data: { email: user.email },
      select: {
        id: true,
        authUserId: true,
        email: true,
      },
    });
  }

  return {
    ok: true,
    user: appUser,
  };
});
