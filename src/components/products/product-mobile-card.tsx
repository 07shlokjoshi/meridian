"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getStockStatus } from "@/lib/format";
import type { Product } from "@/types/product";

interface ProductMobileCardProps {
  product: Product;
}

export const ProductMobileCard = memo(function ProductMobileCard({
  product,
}: ProductMobileCardProps) {
  const stock = getStockStatus(product.stock);

  return (
    <Link
      href={`/products/${product.id}`}
      className="flex gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-muted/30"
    >
      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
        <Image src={product.thumbnail} alt="" fill className="object-cover" sizes="64px" />
      </div>
      <div className="min-w-0 flex-1 space-y-1.5">
        <p className="line-clamp-2 text-sm font-medium leading-snug">{product.title}</p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-[10px] capitalize">
            {product.category}
          </Badge>
          <Badge variant={stock.variant} className="text-[10px]">
            {stock.label}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium tabular-nums">{formatCurrency(product.price)}</span>
          <span className="inline-flex items-center gap-0.5 text-muted-foreground">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {product.rating.toFixed(1)}
          </span>
        </div>
      </div>
      <ChevronRight className="size-4 shrink-0 self-center text-muted-foreground" />
    </Link>
  );
});
