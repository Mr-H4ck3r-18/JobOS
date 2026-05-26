"use client";

import { useTransition } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { logout } from "@/features/auth/actions";

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      title={compact ? "Log out" : undefined}
      className={`group flex items-center rounded-md text-muted-foreground outline-none transition duration-200 hover:bg-secondary/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring ${
        compact ? "h-11 min-w-11 justify-center px-2" : "gap-3 px-3 py-2 text-sm w-full"
      }`}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      <span className={compact ? "sr-only" : ""}>Log out</span>
    </button>
  );
}
