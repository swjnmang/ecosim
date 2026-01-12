'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewLobbyPage() {
  const [lobbyName, setLobbyName] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [startBudget, setStartBudget] = useState('50000');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [modules, setModules] = useState({
    einkauf: true,
    verkauf: true,
    buchung: false,
    mahnung: false,
    kalkulationen: true,
  });

  const [programs, setPrograms] = useState({
    mail: true,
    textverarbeitung: true,
    lager: true,
    produktkatalog: true,
    buchung: false,
    banking: false,
  });

  const [hints, setHints] = useState({
    enabled: true,
    strength: 'medium' as 'light' | 'medium' | 'strong',
  });

  const handleCreateLobby = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Create lobby in Firebase
      // For now, generate PIN locally
      const pin = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Redirect to lobby monitoring page
      router.push(`/lobby/${pin}`);
    } catch (error) {
      alert('Fehler beim Erstellen der Lobby');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Neue Lobby erstellen</h1>

        <form onSubmit={handleCreateLobby} className="space-y-6">
          {/* Lobby Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lobby-Name
            </label>
            <input
              type="text"
              value={lobbyName}
              onChange={(e) => setLobbyName(e.target.value)}
              placeholder="z.B. Klasse 10a - Kaufleute 2026"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schwierigkeitsgrad
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="easy">🟢 Einfach</option>
              <option value="medium">🟡 Mittel</option>
              <option value="hard">🔴 Schwer</option>
            </select>
          </div>

          {/* Start Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Startbudget (EUR)
            </label>
            <input
              type="number"
              value={startBudget}
              onChange={(e) => setStartBudget(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Modules */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Module aktivieren</h3>
            <div className="space-y-2">
              {Object.keys(modules).map((mod) => (
                <label key={mod} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={modules[mod as keyof typeof modules]}
                    onChange={(e) =>
                      setModules({
                        ...modules,
                        [mod]: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  <span className="ml-3 text-gray-700 capitalize">{mod}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Programme aktivieren</h3>
            <div className="space-y-2">
              {Object.keys(programs).map((prog) => (
                <label key={prog} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={programs[prog as keyof typeof programs]}
                    onChange={(e) =>
                      setPrograms({
                        ...programs,
                        [prog]: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  <span className="ml-3 text-gray-700 capitalize">{prog}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Hints */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Hinweise</h3>
            <label className="flex items-center cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={hints.enabled}
                onChange={(e) => setHints({ ...hints, enabled: e.target.checked })}
                className="w-4 h-4 text-green-600 rounded"
              />
              <span className="ml-3 text-gray-700">Hinweise aktivieren</span>
            </label>
            {hints.enabled && (
              <select
                value={hints.strength}
                onChange={(e) => setHints({ ...hints, strength: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="light">Leicht (minimal)</option>
                <option value="medium">Mittel</option>
                <option value="strong">Stark (detailliert)</option>
              </select>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !lobbyName.trim()}
            className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
          >
            {loading ? 'Wird erstellt...' : 'Lobby erstellen'}
          </button>
        </form>

        <div className="mt-6">
          <a href="/dashboard" className="text-green-600 hover:text-green-700">
            ← Zurück zum Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}
