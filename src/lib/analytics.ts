import type { Product } from "@/types/product";

export interface DashboardStats {
  totalProducts: number;
  averageRating: number;
  totalInventoryValue: number;
  categoriesCount: number;
}

export function computeDashboardStats(products: Product[]): DashboardStats {
  const totalProducts = products.length;
  const averageRating =
    totalProducts === 0
      ? 0
      : products.reduce((sum, p) => sum + p.rating, 0) / totalProducts;
  const totalInventoryValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const categoriesCount = new Set(products.map((p) => p.category)).size;

  return { totalProducts, averageRating, totalInventoryValue, categoriesCount };
}

export function getCategoryDistribution(products: Product[]) {
  const counts = new Map<string, number>();
  for (const p of products) {
    counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, value]) => ({ name: capitalizeCategory(name), value }))
    .sort((a, b) => b.value - a.value);
}

export function getRatingDistribution(products: Product[]) {
  const buckets = [
    { range: "0–1", min: 0, max: 1 },
    { range: "1–2", min: 1, max: 2 },
    { range: "2–3", min: 2, max: 3 },
    { range: "3–4", min: 3, max: 4 },
    { range: "4–5", min: 4, max: 5.01 },
  ];

  return buckets.map(({ range, min, max }) => ({
    range,
    count: products.filter((p) => p.rating >= min && p.rating < max).length,
  }));
}

export function getInventoryByCategory(products: Product[]) {
  const values = new Map<string, number>();
  for (const p of products) {
    values.set(p.category, (values.get(p.category) ?? 0) + p.price * p.stock);
  }
  return Array.from(values.entries())
    .map(([name, value]) => ({ name: capitalizeCategory(name), value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
}

export function getStockOverview(products: Product[]) {
  const byCategory = new Map<string, { stock: number; reserved: number }>();

  for (const p of products) {
    const current = byCategory.get(p.category) ?? { stock: 0, reserved: 0 };
    current.stock += p.stock;
    current.reserved += Math.floor(p.stock * 0.12);
    byCategory.set(p.category, current);
  }

  return Array.from(byCategory.entries())
    .map(([category, data]) => ({
      category: capitalizeCategory(category),
      stock: data.stock,
      reserved: data.reserved,
    }))
    .slice(0, 6);
}

function capitalizeCategory(name?: string | null): string {
  if (!name) return "Unknown";
  return name.charAt(0).toUpperCase() + name.slice(1);
}
