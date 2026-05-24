"use client";

import { memo, useCallback } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SortOption, StockFilter } from "@/types/product";
import { capitalize } from "@/lib/format";

interface ProductFiltersProps {
  search: string;
  categories: string[];
  allCategories: string[];
  minRating: number | null;
  stock: StockFilter;
  sort: SortOption;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onCategoriesChange: (value: string[]) => void;
  onRatingChange: (value: number | null) => void;
  onStockChange: (value: StockFilter) => void;
  onSortChange: (value: SortOption) => void;
  onClear: () => void;
}

export const ProductFilters = memo(function ProductFilters({
  search,
  categories,
  allCategories,
  minRating,
  stock,
  sort,
  hasActiveFilters,
  onSearchChange,
  onCategoriesChange,
  onRatingChange,
  onStockChange,
  onSortChange,
  onClear,
}: ProductFiltersProps) {
  const toggleCategory = useCallback(
    (cat: string) => {
      if (categories.includes(cat)) {
        onCategoriesChange(categories.filter((c) => c !== cat));
      } else {
        onCategoriesChange([...categories, cat]);
      }
    },
    [categories, onCategoriesChange]
  );

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="product-search" className="text-xs text-muted-foreground">
            Search
          </Label>
          <Input
            id="product-search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter by name, brand, category…"
            className="h-9"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-auto">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Stock</Label>
            <Select value={stock} onValueChange={(v) => onStockChange(v as StockFilter)}>
              <SelectTrigger className="h-9 w-full min-w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All stock</SelectItem>
                <SelectItem value="in-stock">In stock</SelectItem>
                <SelectItem value="low-stock">Low stock</SelectItem>
                <SelectItem value="out-of-stock">Out of stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Min rating</Label>
            <Select
              value={minRating === null ? "any" : String(minRating)}
              onValueChange={(v) => onRatingChange(v === "any" ? null : Number(v))}
            >
              <SelectTrigger className="h-9 w-full min-w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any rating</SelectItem>
                <SelectItem value="3">3+ stars</SelectItem>
                <SelectItem value="4">4+ stars</SelectItem>
                <SelectItem value="4.5">4.5+ stars</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Sort by</Label>
            <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
              <SelectTrigger className="h-9 w-full min-w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A–Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z–A)</SelectItem>
                <SelectItem value="price-asc">Price (low–high)</SelectItem>
                <SelectItem value="price-desc">Price (high–low)</SelectItem>
                <SelectItem value="rating-desc">Rating (high–low)</SelectItem>
                <SelectItem value="rating-asc">Rating (low–high)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-9 w-full gap-2">
                  <Filter className="size-3.5" />
                  Categories
                  {categories.length > 0 ? (
                    <span className="rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">
                      {categories.length}
                    </span>
                  ) : null}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0" align="end">
                <ScrollArea className="h-56">
                  <div className="space-y-1 p-3">
                    {allCategories.map((cat) => (
                      <label
                        key={cat}
                        className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                      >
                        <Checkbox
                          checked={categories.includes(cat)}
                          onCheckedChange={() => toggleCategory(cat)}
                        />
                        {capitalize(cat)}
                      </label>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {hasActiveFilters ? (
        <div className="flex items-center justify-between border-t border-border pt-3">
          <p className="text-xs text-muted-foreground">Filters applied — share this URL to preserve state</p>
          <Button variant="ghost" size="sm" className="h-8 gap-1.5" onClick={onClear}>
            <X className="size-3.5" />
            Clear all
          </Button>
        </div>
      ) : null}
    </div>
  );
});
