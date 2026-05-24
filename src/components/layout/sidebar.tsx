"use client";

import {
  BarChart3,
  ChevronLeft,
  LayoutDashboard,
  Package,
  Settings,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { APP_NAME, NAV_ITEMS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserMenu } from "./user-menu";

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  Package,
  BarChart3,
  Settings,
};

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  className?: string;
}

export function Sidebar({ collapsed, onToggleCollapse, className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-sidebar text-sidebar-foreground",
        collapsed ? "w-[68px]" : "w-60",
        className
      )}
    >
      <div
        className={cn(
          "flex h-14 items-center border-b border-sidebar-border px-3",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        {!collapsed ? (
          <Link href="/dashboard" className="flex items-center gap-2.5 px-1">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <span className="text-xs font-bold">M</span>
            </div>
            <span className="text-sm font-semibold tracking-tight">{APP_NAME}</span>
          </Link>
        ) : (
          <Link href="/dashboard" className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="text-xs font-bold">M</span>
          </Link>
        )}
        {!collapsed ? (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 text-muted-foreground"
            onClick={onToggleCollapse}
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="size-4" />
          </Button>
        ) : null}
      </div>

      <nav className="flex-1 space-y-0.5 p-2" aria-label="Main">
        {NAV_ITEMS.map((item) => {
          const Icon = ICONS[item.icon];
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                collapsed && "justify-center px-2",
                active
                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed ? <span>{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-2">
        <Separator className="mb-2 bg-sidebar-border" />
        {collapsed ? (
          <div className="flex justify-center pb-2">
            <UserMenu collapsed />
          </div>
        ) : (
          <UserMenu />
        )}
        {collapsed ? (
          <Button
            variant="ghost"
            size="icon"
            className="mx-auto mt-1 flex size-8"
            onClick={onToggleCollapse}
            aria-label="Expand sidebar"
          >
            <ChevronLeft className="size-4 rotate-180" />
          </Button>
        ) : null}
      </div>
    </aside>
  );
}
