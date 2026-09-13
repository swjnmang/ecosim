// Platzhalterdaten, bis Participant-Session und Datenbank angebunden sind.
// Ersetzen durch echte Ladefunktionen (Supabase/Prisma), sobald Auth steht.
import type { OrderDetail, OrderSummary } from "@/types/order";

export const mockParticipant = {
  companyName: "Kettenblatt Handelsgesellschaft",
  balance: 4230,
  department: "EINKAUF" as const,
  pseudonym: "FalkeBlau92",
  inboxCount: 3,
};

export const mockOrders: OrderSummary[] = [
  {
    id: "1",
    orderNumber: "EK-2026-0142",
    type: "EINKAUF",
    counterpartyName: "Nordkomponente Großhandel eG",
    currentStepLabel: "in Bearbeitung",
    isClosed: false,
  },
  {
    id: "2",
    orderNumber: "VK-2026-0301",
    type: "VERKAUF",
    counterpartyName: "Radhaus Sonnwald",
    currentStepLabel: "abgeschlossen",
    isClosed: true,
  },
];

export const mockOrderDetails: Record<string, OrderDetail> = {
  "EK-2026-0142": {
    ...mockOrders[0],
    steps: [
      { id: "s1", label: "Anfrage an Lieferant gesendet", status: "ERLEDIGT", documentHref: "#" },
      { id: "s2", label: "Angebot erhalten und geprüft", status: "ERLEDIGT", documentHref: "#" },
      { id: "s3", label: "Bestellung auslösen", status: "OFFEN" },
      { id: "s4", label: "Wareneingang buchen", status: "OFFEN" },
    ],
  },
  "VK-2026-0301": {
    ...mockOrders[1],
    steps: [
      { id: "s1", label: "Kundenanfrage erhalten", status: "ERLEDIGT", documentHref: "#" },
      { id: "s2", label: "Angebot erstellt", status: "ERLEDIGT", documentHref: "#" },
      { id: "s3", label: "Bestellung eingegangen", status: "ERLEDIGT", documentHref: "#" },
      { id: "s4", label: "Lieferschein erstellt", status: "ERLEDIGT", documentHref: "#" },
      { id: "s5", label: "Rechnung versendet", status: "ERLEDIGT", documentHref: "#" },
    ],
  },
};
