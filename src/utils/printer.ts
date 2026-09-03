import type { CartItem, DestinationArea, OrderType } from "../interfaces/Order";

export interface PrintedTicket {
  tableNumber: string;
  orderType: OrderType;
  destination: DestinationArea;
  timestamp: string;
  items: { productName: string; quantity: number; notes?: string }[];
  isIntegration: boolean;
  generalNotes?: string;
}

// Supporta sia CartItem (con item.product) sia oggetti piatti
export type PrintableItem =
  | CartItem
  | {
      productName: string;
      quantity: number;
      notes?: string;
      destinationArea?: DestinationArea;
    };

export const splitItemsByDestination = (
  items: PrintableItem[],
  tableNumber: string,
  orderType: OrderType,
  isIntegration: boolean = false,
  generalNotes?: string,
): PrintedTicket[] => {
  const grouped = items.reduce(
    (acc, item) => {
      // Normalizzazione dei dati in base alla struttura dell'oggetto
      const isCartItem = "product" in item;

      const dest: DestinationArea = isCartItem
        ? item.product.destinationArea || "SALA"
        : item.destinationArea || "SALA";

      const productName = isCartItem ? item.product.name : item.productName;

      if (!acc[dest]) acc[dest] = [];

      acc[dest].push({
        productName,
        quantity: item.quantity,
        notes: item.notes,
      });

      return acc;
    },
    {} as Record<
      DestinationArea,
      { productName: string; quantity: number; notes?: string }[]
    >,
  );

  const timestamp = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return Object.entries(grouped).map(([dest, groupItems]) => ({
    tableNumber,
    orderType,
    destination: dest as DestinationArea,
    timestamp,
    items: groupItems,
    isIntegration,
    generalNotes,
  }));
};

export const printTickets = (tickets: PrintedTicket[]) => {
  tickets.forEach((ticket) => {
    const printWindow = window.open("", "_blank", "width=350,height=600");
    if (!printWindow) return;

    const doc = printWindow.document;
    doc.title = `Stampa ${ticket.destination}`;

    const style = doc.createElement("style");
    style.textContent = `
      body { font-family: 'Courier New', Courier, monospace; width: 58mm; padding: 4px; margin: 0; color: #000; }
      .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 6px; margin-bottom: 6px; }
      .dest { font-size: 18px; font-weight: bold; text-transform: uppercase; }
      .info { font-size: 14px; font-weight: bold; margin-top: 2px; }
      .notes { border: 1px solid #000; padding: 4px; font-size: 11px; margin-bottom: 6px; }
      .item-row { display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 14px; }
      .item-note { font-size: 12px; font-style: italic; margin-left: 10px; margin-bottom: 4px; }
      .footer { border-top: 1px dashed #000; margin-top: 8px; padding-top: 4px; text-align: center; font-size: 10px; }
    `;
    doc.head.appendChild(style);

    const container = doc.createElement("div");

    const itemsHtml = ticket.items
      .map(
        (item) => `
        <div class="item-row">
          <span><strong>${item.quantity}x</strong> ${item.productName}</span>
        </div>
        ${item.notes ? `<div class="item-note">* Note: ${item.notes}</div>` : ""}
      `,
      )
      .join("");

    container.innerHTML = `
      <div class="header">
        <div class="dest">-- ${ticket.destination} --</div>
        <div class="info">${
          ticket.orderType === "ASPORTO"
            ? "ASPORTO"
            : `TAVOLO ${ticket.tableNumber}`
        }</div>
        <div>Ora: ${ticket.timestamp} ${
          ticket.isIntegration ? " (INTEGRAZIONE)" : ""
        }</div>
      </div>
      ${
        ticket.generalNotes
          ? `<div class="notes"><strong>Note Tavolo:</strong> ${ticket.generalNotes}</div>`
          : ""
      }
      <div>${itemsHtml}</div>
      <div class="footer">KDS Printing System</div>
    `;

    doc.body.appendChild(container);

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 250);
  });
};

export interface CancelTicket {
  orderId?: number;
  tableNumber?: number | string | null;
  orderType: string;
  timestamp?: string;
}

export const printCancellationTicket = (ticket: CancelTicket) => {
  const printWindow = window.open("", "_blank", "width=300,height=400");
  if (!printWindow) return;

  const doc = printWindow.document;
  doc.title = "Stampa Cancellazione";

  const style = doc.createElement("style");
  style.textContent = `
    body { font-family: monospace; width: 58mm; padding: 5px; margin: 0; text-align: center; }
    .title { font-size: 16pt; font-weight: bold; }
    .status { font-size: 14pt; font-weight: bold; border: 2px solid black; margin: 8px 0; padding: 4px; }
    .info { font-size: 12pt; margin: 4px 0; }
  `;
  doc.head.appendChild(style);

  const container = doc.createElement("div");
  const timeString =
    ticket.timestamp ||
    new Intl.DateTimeFormat("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date());

  container.innerHTML = `
    <div class="title">COMANDA CANCELLATA</div>
    <div class="status">*** ANNULLATO ***</div>
    <div class="info">
      ${ticket.orderType === "TAVOLO" && ticket.tableNumber ? `<strong>TAVOLO: ${ticket.tableNumber}</strong>` : `<strong>ASPORTO</strong>`}
    </div>
    ${ticket.orderId ? `<div class="info">Ordine #${ticket.orderId}</div>` : ""}
    <div class="info">${timeString}</div>
  `;

  doc.body.appendChild(container);

  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }, 250);
};
