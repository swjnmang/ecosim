import Link from "next/link";
import { notFound } from "next/navigation";
import { APP_CATALOG } from "@/types/app";
import { OrderStatusApp } from "@/components/auftragsstatus/OrderStatusApp";
import { mockOrders, mockOrderDetails } from "@/data/mockDesktop";

export function generateStaticParams() {
  return APP_CATALOG.map((app) => ({ app: app.key }));
}

export default function AppPage({ params }: { params: { app: string } }) {
  const appDefinition = APP_CATALOG.find((app) => app.key === params.app);
  if (!appDefinition) notFound();

  if (appDefinition.key === "auftragsstatus") {
    return (
      <main className="pt-8">
        <BackLink />
        <OrderStatusApp orders={mockOrders} orderDetails={mockOrderDetails} />
      </main>
    );
  }

  return (
    <main className="pt-8">
      <BackLink />
      <div className="rounded-xl bg-white p-5">
        <div className="mb-2 flex items-center gap-2">
          <i className={`ti ti-${appDefinition.iconName} text-lg text-gray-500`} aria-hidden="true" />
          <p className="text-[15px] font-medium text-gray-900">{appDefinition.label}</p>
        </div>
        <p className="text-sm text-gray-500">Diese App ist noch nicht angebunden.</p>
      </div>
    </main>
  );
}

function BackLink() {
  return (
    <Link href="/app" className="mb-4 inline-flex items-center gap-1 text-xs text-gray-500 hover:underline">
      <i className="ti ti-arrow-left text-sm" aria-hidden="true" />
      Zurück zum Desktop
    </Link>
  );
}
