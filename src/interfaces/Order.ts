import type { Variant } from "react-bootstrap/esm/types";
import type { Product } from "./Product";

export const ALL_ORDER_STATUSES = [
  "ATTIVI",
  "PENDING",
  "PREPARATION",
  "READY",
  "SERVED",
  "COMPLETED",
  "CANCELLED",
] as const;

export type OrderStatusAttivi = (typeof ALL_ORDER_STATUSES)[number];

export type OrderStatus = Exclude<OrderStatusAttivi, "ATTIVI">;

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

const BADGE_VARIANTS: Record<OrderStatus, Variant> = {
  PENDING: "warning",
  PREPARATION: "primary",
  READY: "info",
  SERVED: "secondary",
  COMPLETED: "success",
  CANCELLED: "danger",
};

export const getBadgeVariant = (status: OrderStatus): Variant => {
  return BADGE_VARIANTS[status] ?? "secondary";
};
//Label per i vari stati della preparazione per avere una UI migliore
const NEXT_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Inizia Preparazione",
  PREPARATION: "Pronto per la Sala (READY)",
  READY: "Segna come Servito",
  SERVED: "Incassa (COMPLETED)",
  COMPLETED: "Avanza Stato",
  CANCELLED: "Avanza Stato",
};

export const getNextStatusLabel = (status: OrderStatus): string => {
  return NEXT_STATUS_LABELS[status] ?? "Avanza Stato";
};
