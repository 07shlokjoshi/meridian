export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: ProductReview[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  images: string[];
  thumbnail: string;
}

export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export type StockFilter = "all" | "in-stock" | "low-stock" | "out-of-stock";
export type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc" | "rating-asc" | "rating-desc";

export type ProductColumnId =
  | "image"
  | "title"
  | "category"
  | "price"
  | "stock"
  | "rating"
  | "brand"
  | "actions";

export interface ColumnConfig {
  id: ProductColumnId;
  label: string;
  visible: boolean;
}
