"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bot,
  BriefcaseBusiness,
  FileText,
  LayoutDashboard,
  Send,
  Settings,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth/logout-button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/jobs", label: "Jobs", icon: BriefcaseBusiness },
  { href: "/resumes", label: "Resumes", icon: FileText },
  { href: "/applications", label: "Applications", icon: Send },
  { href: "/automations", label: "Automations", icon: Bot },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const renderNavItem = (item: (typeof navItems)[number], compact = false) => {
    const Icon = item.icon;
    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

    return (
      <Link
        key={item.href}
        href={item.href}
        aria-label={compact ? item.label : undefined}
        title={compact ? item.label : undefined}
        className={cn(
          "group flex items-center rounded-md text-muted-foreground outline-none transition duration-200 hover:bg-secondary/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
          compact ? "h-11 min-w-11 justify-center px-2" : "gap-3 px-3 py-2 text-sm",
          active && "bg-secondary text-foreground",
        )}
      >
        <Icon className="h-4 w-4" />
        <span className={compact ? "sr-only" : undefined}>{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border/70 bg-background/82 px-3 py-4 backdrop-blur-xl lg:block">
        <Link href="/dashboard" className="mb-6 flex items-center gap-3 px-2 transition-opacity hover:opacity-80">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-soft-glow">
            <Sparkles className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-foreground">JobOS</span>
            <span className="block text-xs text-muted-foreground">AI search dashboard</span>
          </span>
        </Link>
        <nav className="space-y-1">
          {navItems.map((item) => renderNavItem(item))}
        </nav>
        <div className="absolute bottom-4 left-3 right-3">
          <LogoutButton />
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border/70 bg-background/80 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Manual approval enabled
              </p>
              <p className="text-sm text-foreground">No application is submitted automatically.</p>
            </div>
            <Button variant="secondary" size="sm">
              <Bot className="h-4 w-4" />
              New run
            </Button>
          </div>
        </header>

        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 4, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ type: "spring", stiffness: 260, damping: 24, mass: 0.9 }}
          className="px-4 py-6 md:px-6 xl:px-8"
        >
          {children}
        </motion.div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/90 px-2 py-2 backdrop-blur-xl lg:hidden">
        <div className="flex justify-around gap-1">
          {navItems.map((item) => renderNavItem(item, true))}
          <LogoutButton compact />
        </div>
      </nav>
    </div>
  );
}
