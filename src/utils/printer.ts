import type {
  CartItem,
  DestinationArea,
  Order,
  OrderType,
} from "../interfaces/Order";

export interface PrintedTicket {
  tableNumber: string;
  orderType: OrderType;
  destination: DestinationArea;
  timestamp: string;
  items: { productName: string; quantity: number; notes?: string }[];
  isIntegration: boolean;
  generalNotes?: string;
}

export type PrintableItem =
  | CartItem
  | {
      productName: string;
      quantity: number;
      notes?: string;
      destinationArea?: DestinationArea;
    };

export interface CancelTicket {
  orderId?: number;
  tableNumber?: number | string | null;
  orderType: string;
  timestamp?: string;
}

/**
 * Escapa i caratteri HTML per evitare stringhe malformate o XSS iniettato nei ticket
 */
const escapeHtml = (str: string): string =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const printHtmlViaIframe = (htmlContent: string): void => {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0px";
  iframe.style.height = "0px";
  iframe.style.border = "0";
  iframe.style.visibility = "hidden";

  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document;
  if (iframeDoc) {
    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();

    iframe.onload = () => {
      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (err) {
          console.error("Errore durante la stampa:", err);
        } finally {
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 1000);
        }
      }, 100);
    };
  }
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

/**
 * Stampa i comandi di reparto
 */
export const printTickets = (tickets: PrintedTicket[]) => {
  tickets.forEach((ticket, index) => {
    setTimeout(() => {
      const itemsHtml = ticket.items
        .map(
          (item) => `
          <div class="item-row">
            <span><strong>${item.quantity}x</strong> ${escapeHtml(item.productName)}</span>
          </div>
          ${
            item.notes
              ? `<div class="item-note">* Note: ${escapeHtml(item.notes)}</div>`
              : ""
          }
        `,
        )
        .join("");

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Stampa ${escapeHtml(ticket.destination)}</title>
          <style>
            @page { size: 80mm auto; margin: 0; }
            html, body { width: 80mm; margin: 0; padding: 0; background: #fff; }
            body { 
              font-family: 'Courier New', Courier, monospace; 
              font-size: 14px; 
              line-height: 1.2; 
              color: #000; 
              padding: 4mm; 
              box-sizing: border-box; 
            }
            * { page-break-inside: avoid; break-inside: avoid; }
            .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 6px; margin-bottom: 6px; }
            .dest { font-size: 20px; font-weight: bold; text-transform: uppercase; }
            .info { font-size: 16px; font-weight: bold; margin-top: 2px; }
            .notes { border: 1px solid #000; padding: 4px; font-size: 12px; margin-bottom: 6px; }
            .item-row { display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 15px; }
            .item-note { font-size: 13px; font-style: italic; margin-left: 10px; margin-bottom: 4px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="dest">-- ${escapeHtml(ticket.destination)} --</div>
            <div class="info">${
              ticket.orderType === "ASPORTO"
                ? "ASPORTO"
                : `TAVOLO ${escapeHtml(ticket.tableNumber)}`
            }</div>
            <div>Ora: ${ticket.timestamp} ${
              ticket.isIntegration ? " (INTEGRAZIONE)" : ""
            }</div>
          </div>
          ${
            ticket.generalNotes
              ? `<div class="notes"><strong>Note Tavolo:</strong> ${escapeHtml(ticket.generalNotes)}</div>`
              : ""
          }
          <div>${itemsHtml}</div>
        </body>
        </html>
      `;

      printHtmlViaIframe(html);
    }, index * 300);
  });
};

/**
 * Stampa il biglietto di cancellazione dell'ordine
 */
export const printCancellationTicket = (ticket: CancelTicket) => {
  const timeString =
    ticket.timestamp ||
    new Intl.DateTimeFormat("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date());

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Stampa Cancellazione</title>
      <style>
        @page { size: 80mm auto; margin: 0; }
        html, body { width: 80mm; margin: 0; padding: 0; background: #fff; }
        body { 
          font-family: 'Courier New', Courier, monospace; 
          padding: 4mm; 
          margin: 0 auto; 
          text-align: center; 
          color: #000; 
          box-sizing: border-box; 
        }
        * { page-break-inside: avoid; break-inside: avoid; }
        .title { font-size: 18pt; font-weight: bold; }
        .status { font-size: 16pt; font-weight: bold; border: 2px solid black; margin: 8px 0; padding: 4px; }
        .info { font-size: 14pt; margin: 4px 0; }
      </style>
    </head>
    <body>
      <div class="title">COMANDA CANCELLATA</div>
      <div class="status">*** ANNULLATO ***</div>
      <div class="info">
        ${
          ticket.orderType === "TAVOLO" && ticket.tableNumber
            ? `<strong>TAVOLO: ${escapeHtml(String(ticket.tableNumber))}</strong>`
            : `<strong>ASPORTO</strong>`
        }
      </div>
      ${ticket.orderId ? `<div class="info">Ordine #${ticket.orderId}</div>` : ""}
      <div class="info">${timeString}</div>
    </body>
    </html>
  `;

  printHtmlViaIframe(html);
};

/**
 * Stampa la ricevuta/scontrino completo dell'ordine
 */
export const printFullOrderTicket = (order: Order): void => {
  const isTable =
    order.orderType === "TAVOLO" ||
    (order.tableNumber !== null && order.tableNumber !== undefined);

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

  const html = `
    <!DOCTYPE html>
    <html lang="it">
    <head>
      <meta charset="UTF-8">
      <title>Stampa Ricevuta #${order.id}</title>
      <style>
        @page {
          size: 80mm auto;
          margin: 0;
        }
        html, body {
          width: 80mm;
          margin: 0;
          padding: 0;
          background: #fff;
        }
        body {
          font-family: 'Courier New', Courier, monospace;
          padding: 4mm;
          color: #000;
          font-size: 13px;
          line-height: 1.2;
          box-sizing: border-box;
        }
        * {
          page-break-inside: avoid;
          break-inside: avoid;
        }
        .text-center { text-align: center; }
        .bold { font-weight: bold; }
        .fs-title { font-size: 18px; }
        .fs-subtitle { font-size: 15px; }
        .divider {
          border-top: 1px dashed #000;
          margin: 6px 0;
        }
        .double-divider {
          border-top: 2px solid #000;
          margin: 6px 0;
        }
        .item-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 3px;
        }
        .item-name {
          flex-grow: 1;
          padding-right: 5px;
        }
        .item-price {
          white-space: nowrap;
        }
        .item-note {
          font-size: 11px;
          padding-left: 12px;
          font-style: italic;
        }
        .total-section {
          font-size: 16px;
          display: flex;
          justify-content: space-between;
          margin-top: 6px;
        }
        .footer {
          margin-top: 12px;
          font-size: 11px;
        }
      </style>
    </head>
    <body>
      <div class="text-center bold fs-title">RICEVUTA COMANDA</div>
      <div class="text-center fs-subtitle bold" style="margin-top: 4px;">
        ${isTable ? `TAVOLO ${escapeHtml(String(order.tableNumber))}` : "ASPORTO"}
      </div>
      
      <div class="divider"></div>

      <div>
        <div><strong>Data:</strong> ${formattedDate}</div>
        ${
          isTable && order.coverCount
            ? `<div><strong>Coperti:</strong> ${order.coverCount}</div>`
            : ""
        }
      </div>

      <div class="double-divider"></div>

      <div class="bold" style="margin-bottom: 4px; display: flex; justify-content: space-between;">
        <span>Q.tà Descrizione</span>
        <span>Prezzo</span>
      </div>

      <div class="divider"></div>

      ${
        order.items && order.items.length > 0
          ? order.items
              .map((item) => {
                const qty = item.quantity ?? 1;
                const unitPrice = item.unitPrice ?? 0;
                const totalPrice = (unitPrice * qty).toFixed(2);
                const name = item.productName || "Prodotto";

                return `
                  <div class="item-row">
                    <span style="min-width: 22px;" class="bold">${qty}x</span>
                    <span class="item-name">${escapeHtml(name)}</span>
                    <span class="item-price bold">€ ${totalPrice}</span>
                  </div>
                  ${
                    item.notes
                      ? `<div class="item-note">* ${escapeHtml(item.notes)}</div>`
                      : ""
                  }
                `;
              })
              .join("")
          : "<div>Nessun articolo presente</div>"
      }

      <div class="double-divider"></div>

      ${
        order.notes
          ? `
            <div style="margin-bottom: 6px;">
              <strong>NOTE:</strong> ${escapeHtml(order.notes)}
            </div>
            <div class="divider"></div>
          `
          : ""
      }

      <div class="total-section bold">
        <span>TOTALE:</span>
        <span>€ ${order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}</span>
      </div>

      <div class="divider"></div>

      <div class="text-center footer">
        Grazie e arrivederci!
      </div>
    </body>
    </html>
  `;

  printHtmlViaIframe(html);
};
