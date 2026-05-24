"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  formatCurrency,
  capitalize,
  getDiscountedPrice,
  getStockStatus,
} from "@/lib/format";
import type { Product } from "@/types/product";

interface ProductDetailViewProps {
  product: Product;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const images = product.images.length > 0 ? product.images : [product.thumbnail];
  const stock = getStockStatus(product.stock);
  const salePrice = getDiscountedPrice(product.price, product.discountPercentage);

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border border-border bg-muted/30">
            <div className="relative aspect-[4/3] max-h-[420px] w-full">
              <Image
                src={images[imageIndex]}
                alt={product.title}
                fill
                className="object-contain p-6"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
            </div>
            {images.length > 1 ? (
              <div className="flex items-center justify-between border-t border-border px-4 py-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={() => setImageIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <div className="flex gap-2 overflow-x-auto px-2">
                  {images.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setImageIndex(i)}
                      className={`relative size-12 shrink-0 overflow-hidden rounded-md border ${
                        i === imageIndex ? "border-primary ring-1 ring-primary" : "border-border"
                      }`}
                    >
                      <Image src={src} alt="" fill className="object-cover" sizes="48px" />
                    </button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={() => setImageIndex((i) => (i === images.length - 1 ? 0 : i + 1))}
                  aria-label="Next image"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            ) : null}
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {product.category}
              </Badge>
              <Badge variant={stock.variant}>{stock.label}</Badge>
              {product.discountPercentage > 0 ? (
                <Badge variant="secondary">-{product.discountPercentage.toFixed(0)}% off</Badge>
              ) : null}
            </div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{product.title}</h1>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-1">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                <span className="font-medium">{product.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">rating</span>
              </span>
              <span className="text-muted-foreground">Brand: {capitalize(product.brand)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold tabular-nums">
                  {formatCurrency(salePrice)}
                </span>
                {product.discountPercentage > 0 ? (
                  <span className="text-sm text-muted-foreground line-through tabular-nums">
                    {formatCurrency(product.price)}
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-muted-foreground">
                List price before {product.discountPercentage}% discount
              </p>
              <Separator />
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Discount</dt>
                  <dd>{product.discountPercentage}%</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Min order</dt>
                  <dd>{product.minimumOrderQuantity} units</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Units in stock</span>
                <span className="text-2xl font-semibold tabular-nums">{product.stock}</span>
              </div>
              <p className="text-xs text-muted-foreground">{product.availabilityStatus}</p>
              <Separator />
              <p className="text-xs leading-relaxed text-muted-foreground">
                {product.shippingInformation}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Product information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2.5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">SKU</dt>
                  <dd className="font-mono text-xs">{product.sku}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Weight</dt>
                  <dd>{product.weight}g</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Dimensions</dt>
                  <dd>
                    {product.dimensions.width}×{product.dimensions.height}×
                    {product.dimensions.depth} cm
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Warranty</dt>
                  <dd className="text-right text-xs">{product.warrantyInformation}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full" asChild>
            <Link href="/products">← Back to products</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
