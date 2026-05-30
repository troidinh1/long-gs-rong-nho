export type OrderStatus = "new" | "contacted" | "confirmed" | "cancelled";

export type Order = {
  id: string;
  name: string;
  phone: string;
  product: string;
  note: string | null;
  status: OrderStatus;
  created_at: string;
};

export type OrderFormData = {
  name: string;
  phone: string;
  product: string;
  note: string;
  status?: OrderStatus;
};