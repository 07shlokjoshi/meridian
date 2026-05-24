import type { Product, SortOption, StockFilter } from "@/types/product";

export function filterProducts(
  products: Product[],
  options: {
    search: string;
    categories: string[];
    minRating: number | null;
    stock: StockFilter;
  }
): Product[] {
  const q = options.search.trim().toLowerCase();

  return products.filter((p) => {
    if (q) {
      const haystack = `${p.title} ${p.brand ?? ""} ${p.category} ${p.description}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    if (options.categories.length > 0 && !options.categories.includes(p.category)) {
      return false;
    }

    if (options.minRating !== null && p.rating < options.minRating) {
      return false;
    }

    if (options.stock === "in-stock" && p.stock <= 0) return false;
    if (options.stock === "low-stock" && (p.stock === 0 || p.stock >= 10)) return false;
    if (options.stock === "out-of-stock" && p.stock > 0) return false;

    return true;
  });
}

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products];

  switch (sort) {
    case "name-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "name-desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating-asc":
      return sorted.sort((a, b) => a.rating - b.rating);
    case "rating-desc":
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
  }
}

export function paginateProducts<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function extractCategories(products: Product[]): string[] {
  return [...new Set(products.map((p) => p.category))].sort();
}
