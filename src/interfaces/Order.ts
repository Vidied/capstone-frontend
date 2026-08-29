import type { Product } from "../features/menu/productSlice";

export type OrderStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "SERVED"
  | "COMPLETED"
  | "CANCELLED";

export type OrderType = "TAVOLO" | "ASPORTO";

export interface OrderItemRequestDTO {
  productId: number;
  quantity: number;
  notes?: string;
}

export interface OrderRequestDTO {
  tableNumber: number | null;
  coverCount: number | null;
  orderType: OrderType;
  notes?: string;
  items: OrderItemRequestDTO[];
}

export interface OrderItem {
  id?: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface Order {
  id: number;
  tableNumber: number | null;
  coverCount: number | null;
  orderType: OrderType;
  orderStatus: OrderStatus;
  notes?: string;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

export interface UpdateOrderStatusDTO {
  orderStatus: OrderStatus;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface OrderSummaryProps {
  cart: CartItem[];
  tableNumber: string;
  coverCount: string;
  orderType: OrderType;
  generalNotes: string;
  onTableNumberChange: (value: string) => void;
  onCoverCountChange: (value: string) => void;
  onOrderTypeChange: (value: OrderType) => void;
  onGeneralNotesChange: (value: string) => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onUpdateNotes: (index: number, notes: string) => void;
  onRemoveItem: (index: number) => void;
  onSubmitOrder: () => void;
  isSubmitting: boolean;
}
