"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DEBOUNCE_MS, PAGE_SIZE } from "@/lib/constants";
import { filterProducts, paginateProducts, sortProducts } from "@/lib/product-filters";
import type { Product, SortOption, StockFilter } from "@/types/product";
import { useDebounce } from "./use-debounce";

function parseCategories(raw: string | null): string[] {
  if (!raw) return [];
  return raw.split(",").filter(Boolean);
}

function parseRating(raw: string | null): number | null {
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function parseStock(raw: string | null): StockFilter {
  const valid: StockFilter[] = ["all", "in-stock", "low-stock", "out-of-stock"];
  if (raw && valid.includes(raw as StockFilter)) return raw as StockFilter;
  return "all";
}

function parseSort(raw: string | null): SortOption {
  const valid: SortOption[] = [
    "name-asc",
    "name-desc",
    "price-asc",
    "price-desc",
    "rating-asc",
    "rating-desc",
  ];
  if (raw && valid.includes(raw as SortOption)) return raw as SortOption;
  return "name-asc";
}

export function useProductFilters(products: Product[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const categories = parseCategories(searchParams.get("category"));
  const minRating = parseRating(searchParams.get("rating"));
  const stock = parseStock(searchParams.get("stock"));
  const sort = parseSort(searchParams.get("sort"));
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  const debouncedSearch = useDebounce(search, DEBOUNCE_MS);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }

      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const setSearch = useCallback(
    (value: string) => updateParams({ search: value || null, page: "1" }),
    [updateParams]
  );

  const setCategories = useCallback(
    (value: string[]) =>
      updateParams({
        category: value.length ? value.join(",") : null,
        page: "1",
      }),
    [updateParams]
  );

  const setMinRating = useCallback(
    (value: number | null) =>
      updateParams({ rating: value !== null ? String(value) : null, page: "1" }),
    [updateParams]
  );

  const setStock = useCallback(
    (value: StockFilter) =>
      updateParams({ stock: value === "all" ? null : value, page: "1" }),
    [updateParams]
  );

  const setSort = useCallback(
    (value: SortOption) => updateParams({ sort: value === "name-asc" ? null : value, page: "1" }),
    [updateParams]
  );

  const setPage = useCallback(
    (value: number) => updateParams({ page: value <= 1 ? null : String(value) }),
    [updateParams]
  );

  const filtered = useMemo(
    () =>
      sortProducts(
        filterProducts(products, {
          search: debouncedSearch,
          categories,
          minRating,
          stock,
        }),
        sort
      ),
    [products, debouncedSearch, categories, minRating, stock, sort]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginated = useMemo(
    () => paginateProducts(filtered, currentPage, PAGE_SIZE),
    [filtered, currentPage]
  );

  const hasActiveFilters =
    debouncedSearch.length > 0 ||
    categories.length > 0 ||
    minRating !== null ||
    stock !== "all";

  return {
    search,
    debouncedSearch,
    categories,
    minRating,
    stock,
    sort,
    page: currentPage,
    filtered,
    paginated,
    total: filtered.length,
    totalPages,
    hasActiveFilters,
    setSearch,
    setCategories,
    setMinRating,
    setStock,
    setSort,
    setPage,
    clearFilters: () => router.push(pathname, { scroll: false }),
  };
}
