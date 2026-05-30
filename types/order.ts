export type OrderStatus = "new" | "contacted" | "confirmed" | "cancelled";

export type CustomerType = "retail" | "dealer";

export type Order = {
  id: string;
  name: string;
  phone: string;
  product: string;
  note: string | null;
  status: OrderStatus;
  created_at: string;

  quantity: number;
  address: string | null;
  customer_type: CustomerType;
  total_price: number;
};

export type OrderFormData = {
  name: string;
  phone: string;
  product: string;
  note: string;
  status?: OrderStatus;

  quantity?: string;
  address?: string;
  customer_type?: CustomerType;
  total_price?: string;
};