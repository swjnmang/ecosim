"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Department } from "@/types/app";

const DEPARTMENT_OPTIONS: { value: Department; label: string }[] = [
  { value: "EINKAUF", label: "Einkauf" },
  { value: "VERKAUF", label: "Verkauf" },
  { value: "BUCHHALTUNG", label: "Buchhaltung" },
];

export default function PlayPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [pseudonym, setPseudonym] = useState("");
  const [department, setDepartment] = useState<Department>("EINKAUF");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (pin.trim().length !== 6) {
      setError("Die Spiel-PIN hat 6 Ziffern.");
      return;
    }
    if (!pseudonym.trim()) {
      setError("Wähle ein Pseudonym - keinen echten Namen.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pin.trim(), pseudonym: pseudonym.trim(), department }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Beitritt fehlgeschlagen.");
        return;
      }
      router.push("/app");
      router.refresh();
    } catch {
      setError("Verbindung fehlgeschlagen. Versuch es noch einmal.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="pt-12">
      <h1 className="mb-1 text-lg font-medium text-gray-900">Spiel beitreten</h1>
      <p className="mb-6 text-sm text-gray-600">
        Kein echter Name nötig - wähle ein Pseudonym, das dich für die anderen in
        deinem Unternehmen erkennbar macht.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-xs text-gray-600">Spiel-PIN</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            placeholder="123456"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-gray-600">Pseudonym</label>
          <input
            type="text"
            value={pseudonym}
            onChange={(event) => setPseudonym(event.target.value)}
            placeholder="z.B. FalkeBlau92"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-gray-600">Abteilung</label>
          <select
            value={department}
            onChange={(event) => setDepartment(event.target.value as Department)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            {DEPARTMENT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {error ? <p className="text-xs text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-60"
        >
          {submitting ? "Beitreten..." : "Beitreten"}
        </button>
      </form>
    </main>
  );
}
