export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number, decimals = 1): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function capitalize(str?: string | null): string {
  if (!str) return "—";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getStockStatus(stock: number): {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
} {
  if (stock === 0) return { label: "Out of stock", variant: "destructive" };
  if (stock < 10) return { label: "Low stock", variant: "outline" };
  return { label: "In stock", variant: "secondary" };
}

export function getDiscountedPrice(price: number, discount: number): number {
  return price * (1 - discount / 100);
}
