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
};