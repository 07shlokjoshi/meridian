"use client";

import Link from "next/link";
import { ArrowRight, Package, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductsQuery } from "@/hooks/use-products-query";
import { computeDashboardStats } from "@/lib/analytics";
import { formatCurrency, formatNumber, getStockStatus } from "@/lib/format";

export function DashboardOverview() {
  const { data: products = [], isLoading } = useProductsQuery();
  const stats = useMemo(() => computeDashboardStats(products), [products]);

  const lowStock = useMemo(
    () => products.filter((p) => p.stock > 0 && p.stock < 10).slice(0, 5),
    [products]
  );

  const topRated = useMemo(
    () => [...products].sort((a, b) => b.rating - a.rating).slice(0, 5),
    [products]
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))
          : (
            <>
              <MetricCard label="Products" value={String(stats.totalProducts)} hint="In catalog" />
              <MetricCard
                label="Avg. rating"
                value={formatNumber(stats.averageRating)}
                hint="Across all SKUs"
              />
              <MetricCard
                label="Inventory value"
                value={formatCurrency(stats.totalInventoryValue)}
                hint="Price × stock"
              />
              <MetricCard
                label="Categories"
                value={String(stats.categoriesCount)}
                hint="Active groupings"
              />
            </>
          )}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="shadow-sm lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Low stock alerts</CardTitle>
              <CardDescription>Products that may need replenishment soon</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/products?stock=low-stock">
                View all
                <ArrowRight className="ml-1 size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12" />)
            ) : lowStock.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No low-stock items right now.</p>
            ) : (
              lowStock.map((p) => {
                const status = getStockStatus(p.stock);
                return (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 transition-colors hover:bg-muted/40"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{p.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{p.category}</p>
                    </div>
                    <span className="shrink-0 text-xs font-medium text-amber-600 dark:text-amber-400">
                      {p.stock} left · {status.label}
                    </span>
                  </Link>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="size-4 text-muted-foreground" />
              Top rated
            </CardTitle>
            <CardDescription>Highest customer ratings this week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10" />)
              : topRated.map((p, i) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="flex items-center gap-3 text-sm hover:text-primary"
                  >
                    <span className="flex size-6 items-center justify-center rounded bg-muted text-xs font-medium">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{p.title}</span>
                    <span className="tabular-nums text-muted-foreground">{p.rating.toFixed(1)}</span>
                  </Link>
                ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-dashed bg-muted/20 shadow-none">
        <CardContent className="flex flex-col items-start gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-background border border-border">
              <Package className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Ready to dig into analytics?</p>
              <p className="text-sm text-muted-foreground">
                Charts and category breakdowns live on the analytics page.
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href="/analytics">Open analytics</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="pt-5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
        <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}
