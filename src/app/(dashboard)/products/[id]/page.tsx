"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { AppBreadcrumbs } from "@/components/common/breadcrumbs";
import { EmptyState } from "@/components/common/empty-state";
import { ProductDetailView } from "@/components/products/product-detail-view";
import { ProductsSkeleton } from "@/components/products/products-skeleton";
import { fetchProductById } from "@/services/products";
import { PackageSearch } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["product", id],
    queryFn: ({ signal }) => fetchProductById(id, signal),
    enabled: Boolean(id),
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AppBreadcrumbs />
      {isLoading ? (
        <ProductsSkeleton />
      ) : isError || !data ? (
        <EmptyState
          icon={PackageSearch}
          title="Product not found"
          description="This item may have been removed or the ID is invalid."
          actionLabel="Retry"
          onAction={() => refetch()}
        />
      ) : (
        <ProductDetailView product={data} />
      )}
    </div>
  );
}
