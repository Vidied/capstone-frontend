import type { Product } from "./Product";

export type OrderStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "SERVED"
  | "COMPLETED"
  | "CANCELLED";

export interface OrderItem {
  id?: number;
  product: Product;
  quantity: number;
  unitPrice: number;
}

export interface OrderItemRequestDTO {
  productId: number;
  quantity: number;
}

export interface Order {
  id: number;
  tableNumber: number;
  coverCount: number;
  orderStatus: OrderStatus;
  notes?: string;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderRequestDTO {
  tableNumber: number;
  coverCount: number;
  orderStatus?: OrderStatus;
  notes?: string;
  items: OrderItemRequestDTO[];
}

export interface UpdateOrderStatusDTO {
  orderStatus: OrderStatus;
}
