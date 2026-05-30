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
  phone: string;
  name: string;
  address: string | null;
  customer_type: "retail" | "dealer";
  total_orders: number;
  confirmed_orders: number;
  cancelled_orders: number;
  total_spent: number;
  last_order_at: string;
  orders: CustomerOrder[];
};