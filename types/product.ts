export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  name: string;
  weight: string;
  price: number;
  description: string | null;
  image_url: string;
  badge: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  category_id: string | null;
  categories?: ProductCategory | null;
};

export type ProductFormData = {
  name: string;
  weight: string;
  price: string;
  description: string;
  image_url: string;
  badge: string;
  is_active: boolean;
  sort_order: string;
  category_id?: string;
};