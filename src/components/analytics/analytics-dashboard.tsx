"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Boxes, Layers, Star, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/analytics/stat-card";
import {
  computeDashboardStats,
  getCategoryDistribution,
  getInventoryByCategory,
  getRatingDistribution,
  getStockOverview,
} from "@/lib/analytics";
import { formatCompact, formatCurrency, formatNumber } from "@/lib/format";
import { useProductsQuery } from "@/hooks/use-products-query";

const CategoryPieChart = dynamic(
  () =>
    import("@/components/analytics/charts/category-pie-chart").then((m) => m.CategoryPieChart),
  { loading: () => <ChartSkeleton />, ssr: false }
);

const RatingBarChart = dynamic(
  () =>
    import("@/components/analytics/charts/rating-bar-chart").then((m) => m.RatingBarChart),
  { loading: () => <ChartSkeleton />, ssr: false }
);

const InventoryBarChart = dynamic(
  () =>
    import("@/components/analytics/charts/inventory-bar-chart").then((m) => m.InventoryBarChart),
  { loading: () => <ChartSkeleton tall />, ssr: false }
);

const StockAreaChart = dynamic(
  () =>
    import("@/components/analytics/charts/stock-area-chart").then((m) => m.StockAreaChart),
  { loading: () => <ChartSkeleton tall />, ssr: false }
);

function ChartSkeleton({ tall }: { tall?: boolean }) {
  return <Skeleton className={tall ? "h-[360px] w-full rounded-xl" : "h-[340px] w-full rounded-xl"} />;
}

export function AnalyticsDashboard() {
  const { data: products = [], isLoading, isError } = useProductsQuery();

  const stats = useMemo(() => computeDashboardStats(products), [products]);
  const categoryData = useMemo(() => getCategoryDistribution(products), [products]);
  const ratingData = useMemo(() => getRatingDistribution(products), [products]);
  const inventoryData = useMemo(() => getInventoryByCategory(products), [products]);
  const stockData = useMemo(() => getStockOverview(products), [products]);

  if (isError) {
    return (
      <p className="text-sm text-destructive">Unable to load analytics. Check your connection.</p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-xl" />)
        ) : (
          <>
            <StatCard
              title="Total products"
              value={String(stats.totalProducts)}
              description="Active SKUs in your catalog from DummyJSON."
              icon={Boxes}
              trend={4.2}
            />
            <StatCard
              title="Average rating"
              value={formatNumber(stats.averageRating)}
              description="Mean customer rating across all listed products."
              icon={Star}
              trend={1.8}
            />
            <StatCard
              title="Inventory value"
              value={formatCompact(stats.totalInventoryValue)}
              description={`Full value: ${formatCurrency(stats.totalInventoryValue)}`}
              icon={Wallet}
              trend={-2.1}
            />
            <StatCard
              title="Categories"
              value={String(stats.categoriesCount)}
              description="Distinct categories represented in the catalog."
              icon={Layers}
              trend={0}
            />
          </>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {isLoading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            <CategoryPieChart data={categoryData} />
            <RatingBarChart data={ratingData} />
          </>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {isLoading ? (
          <>
            <ChartSkeleton tall />
            <ChartSkeleton tall />
          </>
        ) : (
          <>
            <InventoryBarChart data={inventoryData} />
            <StockAreaChart data={stockData} />
          </>
        )}
      </div>
    </div>
  );
}
