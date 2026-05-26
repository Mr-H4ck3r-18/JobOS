import { ReactNode } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-background text-foreground overflow-hidden relative">
      {/* Abstract Background */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute h-full w-full bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-20 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Link href="/" className="flex flex-col items-center gap-2 mb-8 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all group-hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] group-hover:scale-105">
            <Sparkles className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">JobOS</span>
        </Link>
        {children}
      </div>
    </div>
  );
}
