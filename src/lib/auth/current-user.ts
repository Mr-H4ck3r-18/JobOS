import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

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
  const headerStore = await headers();
  const authUserId = headerStore.get("x-supabase-user-id");
  const authEmail = headerStore.get("x-supabase-user-email");
  const authFullName = headerStore.get("x-supabase-user-name");

  if (!authUserId || !authEmail) {
    return {
      ok: false,
      reason: "unauthenticated",
      message: "Sign in to access this page.",
    };
  }

  let appUser = await prisma.user.findUnique({
    where: { authUserId: authUserId },
    select: {
      id: true,
      authUserId: true,
      email: true,
    },
  });

  if (!appUser) {
    appUser = await prisma.user.create({
      data: {
        authUserId: authUserId,
        email: authEmail,
        fullName: authFullName ?? null,
      },
      select: {
        id: true,
        authUserId: true,
        email: true,
      },
    });
  } else if (appUser.email !== authEmail) {
    // Only update if email changed
    appUser = await prisma.user.update({
      where: { authUserId: authUserId },
      data: { email: authEmail },
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
