export type OrderStepStatus = "OFFEN" | "ERLEDIGT";

export interface OrderStepView {
  id: string;
  label: string;
  status: OrderStepStatus;
  // Vorhanden, wenn der Schritt abgeschlossen ist und ein Dokument erzeugt hat -
  // macht den Schritt in der Detailansicht anklickbar.
  documentHref?: string;
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  type: "EINKAUF" | "VERKAUF";
  counterpartyName: string;
  currentStepLabel: string;
  isClosed: boolean;
}

export interface OrderDetail extends OrderSummary {
  steps: OrderStepView[];
}
