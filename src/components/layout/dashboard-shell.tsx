"use client";

import { useEffect, useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";
import { TopNavbar } from "./top-navbar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const mounted = useMounted();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    if (isTablet) setCollapsed(true);
    if (!isTablet && !isMobile) setCollapsed(false);
  }, [isTablet, isMobile, mounted]);

  return (
    <div className="flex min-h-screen bg-background">
      {mounted && !isMobile ? (
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
          className="sticky top-0 hidden h-screen shrink-0 lg:flex"
        />
      ) : null}

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-60 p-0" showCloseButton={false}>
          <Sidebar collapsed={false} onToggleCollapse={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavbar onMenuClick={() => setMobileOpen(true)} />
        <main className={cn("flex-1 p-4 md:p-6 lg:p-8")}>{children}</main>
      </div>
    </div>
  );
}
