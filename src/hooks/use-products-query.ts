"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/products";
import { POLL_INTERVAL_MS } from "@/lib/constants";
import type { Product } from "@/types/product";

export const PRODUCTS_QUERY_KEY = ["products"] as const;

function applyLiveStockJitter(products: Product[]): Product[] {
  return products.map((p) => {
    if (Math.random() > 0.35) return p;
    const delta = Math.random() > 0.5 ? 1 : -1;
    return { ...p, stock: Math.max(0, p.stock + delta) };
  });
}

export function useProductsQuery(options?: { enablePolling?: boolean }) {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: async ({ signal }) => {
      const data = await fetchProducts({ limit: 100, signal });
      return data.products;
    },
    staleTime: 10_000,
    refetchInterval: options?.enablePolling ? POLL_INTERVAL_MS : false,
    refetchIntervalInBackground: true,
    placeholderData: (prev) => prev,
  });
}

export function useLiveProducts() {
  const query = useProductsQuery({ enablePolling: true });
  const { data: queryData, dataUpdatedAt } = query;

  const data = useMemo(() => {
    if (!queryData) return undefined;
    // Reference dataUpdatedAt so useMemo re-runs and applies new stock jitter on query refetches
    void dataUpdatedAt;
    return applyLiveStockJitter(queryData);
  }, [queryData, dataUpdatedAt]);

  return {
    ...query,
    data,
    isLive: Boolean(query.data) && query.isFetching,
    lastUpdated: dataUpdatedAt,
  };
}
