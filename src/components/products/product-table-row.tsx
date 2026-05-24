"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, MoreHorizontal, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency, capitalize, getStockStatus } from "@/lib/format";
import type { ColumnConfig, Product } from "@/types/product";
import { cn } from "@/lib/utils";

interface ProductTableRowProps {
  product: Product;
  columns: ColumnConfig[];
}

function renderCell(id: ColumnConfig["id"], product: Product) {
  const stock = getStockStatus(product.stock);

  switch (id) {
    case "image":
      return (
        <div className="relative size-10 overflow-hidden rounded-md border border-border bg-muted">
          <Image
            src={product.thumbnail}
            alt=""
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
      );
    case "title":
      return (
        <div className="min-w-[180px] max-w-[240px]">
          <p className="truncate font-medium">{product.title}</p>
          <p className="truncate text-xs text-muted-foreground">SKU {product.sku}</p>
        </div>
      );
    case "category":
      return (
        <Badge variant="outline" className="font-normal capitalize">
          {product.category}
        </Badge>
      );
    case "price":
      return <span className="tabular-nums">{formatCurrency(product.price)}</span>;
    case "stock":
      return <Badge variant={stock.variant}>{stock.label}</Badge>;
    case "rating":
      return (
        <span className="inline-flex items-center gap-1 tabular-nums text-sm">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          {product.rating.toFixed(1)}
        </span>
      );
    case "brand":
      return <span className="text-sm text-muted-foreground">{capitalize(product.brand)}</span>;
    case "actions":
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/products/${product.id}`}>
                <Eye className="mr-2 size-4" />
                View details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    default:
      return null;
  }
}

export const ProductTableRow = memo(function ProductTableRow({
  product,
  columns,
}: ProductTableRowProps) {
  const visible = columns.filter((c) => c.visible);

  return (
    <TableRow className="group transition-colors hover:bg-muted/40">
      {visible.map((col) => (
        <TableCell
          key={col.id}
          className={cn(
            col.id === "actions" && "w-12 text-right",
            col.id === "image" && "w-14"
          )}
        >
          {renderCell(col.id, product)}
        </TableCell>
      ))}
    </TableRow>
  );
});
