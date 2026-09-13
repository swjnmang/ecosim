import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center gap-8 pt-16 text-center">
      <div>
        <h1 className="text-2xl font-medium text-gray-900">EcoSim</h1>
        <p className="mt-2 text-sm text-gray-600">
          Übungsunternehmen-Simulation für den Handel mit Fahrrad- und E-Bike-Zubehör
        </p>
      </div>

      <Link
        href="/play"
        className="rounded-md bg-brand-600 px-6 py-3 text-sm font-medium text-white hover:bg-brand-800"
      >
        Mit PIN beitreten
      </Link>

      <div className="flex gap-6 text-xs text-gray-500">
        <Link href="/teacher" className="hover:underline">
          Lehrkraft-Anmeldung
        </Link>
        <Link href="/admin" className="hover:underline">
          Schul-Admin-Anmeldung
        </Link>
      </div>
    </main>
  );
}
