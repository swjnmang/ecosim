"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { OrderDetail, OrderSummary } from "@/types/order";

interface OrderStatusAppProps {
  orders: OrderSummary[];
  orderDetails: Record<string, OrderDetail>;
}

export function OrderStatusApp({ orders, orderDetails }: OrderStatusAppProps) {
  const [query, setQuery] = useState("");
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    if (!query.trim()) return orders;
    const needle = query.trim().toLowerCase();
    return orders.filter((order) => order.orderNumber.toLowerCase().includes(needle));
  }, [orders, query]);

  const selectedOrder = selectedOrderNumber ? orderDetails[selectedOrderNumber] : undefined;

  return (
    <div className="rounded-xl bg-white p-5">
      <div className="mb-3 flex items-center gap-2">
        <i className="ti ti-list-search text-lg text-gray-500" aria-hidden="true" />
        <p className="text-[15px] font-medium text-gray-900">Auftragsstatus</p>
      </div>

      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Auftragsnummer eingeben, z.B. EK-2026-0142"
        className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      />

      <div className="mb-5 flex flex-col gap-2">
        {filteredOrders.length === 0 ? (
          <p className="text-sm text-gray-500">Kein Auftrag mit dieser Nummer gefunden.</p>
        ) : (
          filteredOrders.map((order) => (
            <button
              key={order.id}
              onClick={() => setSelectedOrderNumber(order.orderNumber)}
              className={`flex items-center justify-between rounded-md border px-3 py-2.5 text-left ${
                selectedOrderNumber === order.orderNumber ? "border-brand-400" : "border-gray-200"
              }`}
            >
              <div>
                <p className="text-[13px] font-medium text-gray-900">{order.orderNumber}</p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {order.type === "EINKAUF" ? "Einkauf" : "Verkauf"} · {order.counterpartyName}
                </p>
              </div>
              <span
                className={`rounded-md px-2.5 py-1 text-xs ${
                  order.isClosed ? "bg-brand-50 text-brand-800" : "bg-accent-50 text-accent-600"
                }`}
              >
                {order.isClosed ? "abgeschlossen" : order.currentStepLabel}
              </span>
            </button>
          ))
        )}
      </div>

      {selectedOrder ? (
        <div className="border-t border-gray-200 pt-4">
          <p className="mb-3 text-[13px] font-medium text-gray-900">{selectedOrder.orderNumber} · Details</p>
          <div className="flex flex-col">
            {selectedOrder.steps.map((step, index) => {
              const isLast = index === selectedOrder.steps.length - 1;
              const content = (
                <>
                  <div className="flex flex-col items-center">
                    {step.status === "ERLEDIGT" ? (
                      <span className="flex h-[20px] w-[20px] items-center justify-center rounded-full bg-brand-50 text-brand-600">
                        <i className="ti ti-check text-[14px]" aria-hidden="true" />
                      </span>
                    ) : (
                      <span className="block h-[14px] w-[14px] rounded-full border-2 border-gray-300" />
                    )}
                    {!isLast && <div className="h-5 w-px bg-gray-200" />}
                  </div>
                  <p
                    className={`text-[13px] ${
                      step.status === "ERLEDIGT" ? "text-gray-900" : "text-gray-500"
                    } ${step.documentHref ? "underline decoration-dotted underline-offset-2" : ""}`}
                  >
                    {step.label}
                  </p>
                </>
              );

              return step.documentHref ? (
                <Link key={step.id} href={step.documentHref} className="mb-1 flex items-start gap-2.5">
                  {content}
                </Link>
              ) : (
                <div key={step.id} className="mb-1 flex items-start gap-2.5">
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
