'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [lobbies, setLobbies] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateLobby = () => {
    router.push('/lobby/new');
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Verwalte deine Lobbys und überwache Schüler</p>
          </div>
          <button
            onClick={handleCreateLobby}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
          >
            + Neue Lobby
          </button>
        </div>

        {/* Lobbies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lobbies.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 text-lg mb-6">
                Du hast noch keine Lobbys erstellt
              </p>
              <button
                onClick={handleCreateLobby}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
              >
                Erste Lobby erstellen
              </button>
            </div>
          ) : (
            lobbies.map((lobby: any) => (
              <div
                key={lobby.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
                onClick={() => router.push(`/lobby/${lobby.id}`)}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-2">{lobby.name}</h2>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>PIN: <span className="font-mono font-bold">{lobby.pin}</span></p>
                  <p>Status: <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded">{lobby.status}</span></p>
                  <p>Spieler: {lobby.playerCount || 0}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow">
          <button
            onClick={() => {
              localStorage.removeItem('teacherId');
              router.push('/');
            }}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Abmelden
          </button>
        </div>
      </div>
    </main>
  );
}
