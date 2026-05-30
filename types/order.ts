export type OrderStatus =
  | "pending"
  | "preparing"
  | "shipping"
  | "completed"
  | "cancelled";

export type CustomerType = "retail" | "dealer";

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_weight: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
  created_at: string;
};

export type Order = {
  id: string;
  order_code: string | null;
  name: string;
  phone: string;
  product: string;
  note: string | null;
  status: OrderStatus;
  quantity: number;
  address: string | null;
  customer_type: CustomerType;
  total_price: number;
  created_at: string;
  order_items?: OrderItem[];
};

export type OrderFormData = {
  name: string;
  phone: string;
  product: string;
  note: string;
  status: OrderStatus;
  quantity: string;
  address: string;
  customer_type: CustomerType;
  total_price: string;
};