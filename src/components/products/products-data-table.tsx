"use client";

import { memo, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { Eye, MoreHorizontal, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, capitalize, getStockStatus } from "@/lib/format";
import type { ColumnConfig, Product, ProductColumnId } from "@/types/product";
import { ProductMobileCard } from "./product-mobile-card";

interface ProductsDataTableProps {
  products: Product[];
  columns: ColumnConfig[];
}

function useProductColumns(
  visibleColumns: ColumnConfig[]
): ColumnDef<Product>[] {
  return useMemo(() => {
    const defs: Record<ProductColumnId, ColumnDef<Product>> = {
      image: {
        id: "image",
        header: "Image",
        cell: ({ row }) => (
          <div className="relative size-10 overflow-hidden rounded-md border border-border bg-muted">
            <Image
              src={row.original.thumbnail}
              alt=""
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
        ),
        size: 56,
      },
      title: {
        id: "title",
        header: "Product",
        cell: ({ row }) => (
          <div className="min-w-[180px] max-w-[240px]">
            <p className="truncate font-medium">{row.original.title}</p>
            <p className="truncate text-xs text-muted-foreground">
              SKU {row.original.sku}
            </p>
          </div>
        ),
      },
      category: {
        id: "category",
        header: "Category",
        cell: ({ row }) => (
          <Badge variant="outline" className="font-normal capitalize">
            {row.original.category}
          </Badge>
        ),
      },
      price: {
        id: "price",
        header: "Price",
        cell: ({ row }) => (
          <span className="tabular-nums">{formatCurrency(row.original.price)}</span>
        ),
      },
      stock: {
        id: "stock",
        header: "Stock",
        cell: ({ row }) => {
          const stock = getStockStatus(row.original.stock);
          return <Badge variant={stock.variant}>{stock.label}</Badge>;
        },
      },
      rating: {
        id: "rating",
        header: "Rating",
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1 tabular-nums text-sm">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            {row.original.rating.toFixed(1)}
          </span>
        ),
      },
      brand: {
        id: "brand",
        header: "Brand",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {capitalize(row.original.brand ?? "")}
          </span>
        ),
      },
      actions: {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/products/${row.original.id}`}>
                  <Eye className="mr-2 size-4" />
                  View details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        size: 48,
      },
    };

    return visibleColumns
      .map((col) => defs[col.id])
      .filter((col): col is ColumnDef<Product> => Boolean(col));
  }, [visibleColumns]);
}

export const ProductsDataTable = memo(function ProductsDataTable({
  products,
  columns,
}: ProductsDataTableProps) {
  const visibleColumns = useMemo(
    () => columns.filter((c) => c.visible),
    [columns]
  );

  const columnDefs = useProductColumns(visibleColumns);

  const table = useReactTable({
    data: products,
    columns: columnDefs,
    getCoreRowModel: getCoreRowModel(),
  });

  const renderHeader = useCallback(
    () =>
      table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <TableHead
              key={header.id}
              className={header.column.id === "actions" ? "w-12 text-right" : undefined}
            >
              {header.isPlaceholder
                ? null
                : flexRender(header.column.columnDef.header, header.getContext())}
            </TableHead>
          ))}
        </TableRow>
      )),
    [table]
  );

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-border md:block">
        <div className="max-h-[calc(100vh-320px)] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm">
              {renderHeader()}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="transition-colors hover:bg-muted/40"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="space-y-2 md:hidden">
        {products.map((product) => (
          <ProductMobileCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
});
