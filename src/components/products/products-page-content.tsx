"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { PackageSearch } from "lucide-react";
import { toast } from "sonner";
import { AppBreadcrumbs } from "@/components/common/breadcrumbs";
import { EmptyState } from "@/components/common/empty-state";
import { LiveBadge } from "@/components/common/live-badge";
import { PageHeader } from "@/components/common/page-header";
import { ErrorBoundary } from "@/components/common/error-boundary";
import { ColumnSettings } from "@/components/products/column-settings";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductsPagination } from "@/components/products/products-pagination";
import { ProductsSkeleton } from "@/components/products/products-skeleton";
import { ProductsDataTable } from "@/components/products/products-data-table";
import { useColumnPreferences } from "@/hooks/use-column-preferences";
import { useProductFilters } from "@/hooks/use-product-filters";
import { useLiveProducts } from "@/hooks/use-products-query";
import { extractCategories } from "@/lib/product-filters";

function ProductsContent() {
  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    dataUpdatedAt,
  } = useLiveProducts();
  const lastUpdatedRef = useRef<number | null>(null);
  const filters = useProductFilters(products);
  const { columns, toggleColumn, reorderColumns, resetColumns } = useColumnPreferences();

  const allCategories = useMemo(() => extractCategories(products), [products]);

  useEffect(() => {
    if (!dataUpdatedAt || isLoading) return;
    if (lastUpdatedRef.current && lastUpdatedRef.current !== dataUpdatedAt) {
      toast.message("Catalog refreshed", {
        description: "Stock levels may have changed.",
        duration: 2000,
      });
    }
    lastUpdatedRef.current = dataUpdatedAt;
  }, [dataUpdatedAt, isLoading]);

  return (
    <div className="space-y-6">
      <AppBreadcrumbs />
      <PageHeader
        title="Products"
        description="Manage catalog inventory, pricing, and availability. Filters sync to the URL for sharing."
      >
        <div className="flex items-center gap-2">
          <LiveBadge active={isFetching || !isLoading} />
          <ColumnSettings
            columns={columns}
            onToggle={toggleColumn}
            onReorder={reorderColumns}
            onReset={resetColumns}
          />
        </div>
      </PageHeader>

      <ProductFilters
        search={filters.search}
        categories={filters.categories}
        allCategories={allCategories}
        minRating={filters.minRating}
        stock={filters.stock}
        sort={filters.sort}
        hasActiveFilters={filters.hasActiveFilters}
        onSearchChange={filters.setSearch}
        onCategoriesChange={filters.setCategories}
        onRatingChange={filters.setMinRating}
        onStockChange={filters.setStock}
        onSortChange={filters.setSort}
        onClear={filters.clearFilters}
      />

      <ErrorBoundary fallbackTitle="Could not render product table">
        {isLoading ? (
          <ProductsSkeleton />
        ) : isError ? (
          <EmptyState
            icon={PackageSearch}
            title="Failed to load products"
            description={error?.message ?? "Something went wrong while fetching the catalog."}
            actionLabel="Retry"
            onAction={() => refetch()}
          />
        ) : filters.paginated.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="No products match"
            description="Try adjusting filters or clearing your search to see more results."
            actionLabel={filters.hasActiveFilters ? "Clear filters" : undefined}
            onAction={filters.hasActiveFilters ? filters.clearFilters : undefined}
          />
        ) : (
          <>
            <ProductsDataTable products={filters.paginated} columns={columns} />
            <ProductsPagination
              page={filters.page}
              totalPages={filters.totalPages}
              total={filters.total}
              onPageChange={filters.setPage}
            />
          </>
        )}
      </ErrorBoundary>
    </div>
  );
}

export function ProductsPageContent() {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <ProductsContent />
    </Suspense>
  );
}
