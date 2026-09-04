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

export type DestinationArea = "PIZZERIA" | "CUCINA" | "SALA";

export interface OrderItemRequestDTO {
  productId: number;
  quantity: number;
  notes?: string;
}

export interface AddOrderItemRequestDTO {
  orderId: number;
  items: OrderItemRequestDTO[];
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
  productName: string | null;
  quantity: number;
  unitPrice: number;
  notes?: string;
  destinationArea?: DestinationArea | null;
}

export interface Order {
  id: number;
  tableNumber: number | null;
  coverCount: number | null;
  orderType: OrderType;
  createdAt: string;
  orderStatus: OrderStatus;
  notes?: string;
  totalAmount: number;
  items: OrderItem[];
}

export interface UpdateOrderStatusDTO {
  orderStatus: OrderStatus;
}

export interface AppendItemsDTO {
  items: Array<{
    productId: number;
    quantity: number;
    notes?: string;
  }>;
  coverCount?: number | null;
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

const DESTINATION_BADGE: Record<DestinationArea, Variant> = {
  PIZZERIA: "warning",
  CUCINA: "danger",
  SALA: "info",
};

export const getDestinationBadge = (destination: DestinationArea): Variant => {
  return DESTINATION_BADGE[destination] ?? "info";
};

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
  PREPARATION: "Pronto per la Sala",
  READY: "Segna come Servito",
  SERVED: "Incassa",
  COMPLETED: "Avanza Stato",
  CANCELLED: "Avanza Stato",
};

export const getNextStatusLabel = (status: OrderStatus): string => {
  return NEXT_STATUS_LABELS[status] ?? "Avanza Stato";
};
