import { OrderStatus } from "./order";

export type CustomerOrder = {
  id: string;
  name: string;
  phone: string;
  product: string;
  status: OrderStatus;
  total_price: number;
  quantity: number;
  address: string | null;
  customer_type: "retail" | "dealer";
  created_at: string;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  normalized_phone: string;
  address: string | null;
  customer_type: "retail" | "dealer";
  total_orders: number;
  confirmed_orders: number;
  cancelled_orders: number;
  total_spent: number;
  last_order_at: string | null;
  created_at: string;
  updated_at: string;
  orders: CustomerOrder[];
};