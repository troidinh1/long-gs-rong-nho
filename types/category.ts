export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export type CategoryFormData = {
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  sort_order: string;
};