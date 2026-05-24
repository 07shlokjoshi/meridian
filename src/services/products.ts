import type { Product, ProductsResponse } from "@/types/product";

const BASE_URL = "https://dummyjson.com";

export async function fetchProducts(params?: {
  limit?: number;
  skip?: number;
  signal?: AbortSignal;
}): Promise<ProductsResponse> {
  const limit = params?.limit ?? 100;
  const skip = params?.skip ?? 0;
  const res = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`, {
    signal: params?.signal,
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch products (${res.status})`);
  }

  return res.json();
}

export async function fetchProductById(
  id: string | number,
  signal?: AbortSignal
): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    signal,
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`Product not found (${res.status})`);
  }

  return res.json();
}

export async function searchProducts(
  query: string,
  signal?: AbortSignal
): Promise<ProductsResponse> {
  const res = await fetch(
    `${BASE_URL}/products/search?q=${encodeURIComponent(query)}`,
    { signal, next: { revalidate: 0 } }
  );

  if (!res.ok) {
    throw new Error(`Search failed (${res.status})`);
  }

  return res.json();
}
