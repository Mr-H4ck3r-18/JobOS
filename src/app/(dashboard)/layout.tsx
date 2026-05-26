import { AppShell } from "@/components/layout/app-shell";

export const preferredRegion = "auto";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell>{children}</AppShell>;
}
