import type { ColumnConfig, ProductColumnId } from "@/types/product";

export const APP_NAME = "Meridian";
export const PAGE_SIZE = 10;
export const POLL_INTERVAL_MS = 15_000;
export const DEBOUNCE_MS = 500;

export const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: "image", label: "Image", visible: true },
  { id: "title", label: "Product", visible: true },
  { id: "category", label: "Category", visible: true },
  { id: "price", label: "Price", visible: true },
  { id: "stock", label: "Stock", visible: true },
  { id: "rating", label: "Rating", visible: true },
  { id: "brand", label: "Brand", visible: true },
  { id: "actions", label: "", visible: true },
];

export const COLUMN_STORAGE_KEY = "meridian-product-columns";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" as const },
  { href: "/products", label: "Products", icon: "Package" as const },
  { href: "/analytics", label: "Analytics", icon: "BarChart3" as const },
  { href: "/settings", label: "Settings", icon: "Settings" as const },
] as const;

export const REORDERABLE_COLUMNS: ProductColumnId[] = [
  "image",
  "title",
  "category",
  "price",
  "stock",
  "rating",
  "brand",
];
