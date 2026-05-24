"use client";

import { memo } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ColumnConfig, Product } from "@/types/product";
import { ProductTableRow } from "./product-table-row";
import { ProductMobileCard } from "./product-mobile-card";

interface ProductsTableProps {
  products: Product[];
  columns: ColumnConfig[];
}

export const ProductsTable = memo(function ProductsTable({
  products,
  columns,
}: ProductsTableProps) {
  const visible = columns.filter((c) => c.visible);

  return (
    <>
      <div className="hidden md:block overflow-hidden rounded-xl border border-border">
        <div className="max-h-[calc(100vh-320px)] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm">
              <TableRow>
                {visible.map((col) => (
                  <TableHead
                    key={col.id}
                    className={col.id === "actions" ? "w-12 text-right" : undefined}
                  >
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <ProductTableRow
                  key={product.id}
                  product={product}
                  columns={columns}
                />
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
