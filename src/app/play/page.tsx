"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PlayPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [pseudonym, setPseudonym] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (pin.trim().length !== 6) {
      setError("Die Spiel-PIN hat 6 Ziffern.");
      return;
    }
    if (!pseudonym.trim()) {
      setError("Wähle ein Pseudonym - keinen echten Namen.");
      return;
    }
    // TODO: sobald Supabase/Prisma angebunden sind, hier PIN validieren,
    // Participant mit Session-Token anlegen und companyId/department laden.
    router.push("/app");
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

        {error ? <p className="text-xs text-red-600">{error}</p> : null}

        <button
          type="submit"
          className="rounded-md bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-800"
        >
          Beitreten
        </button>
      </form>
    </main>
  );
}
