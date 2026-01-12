'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function LobbyMonitorPage() {
  const params = useParams();
  const lobbyId = params.lobbyId as string;
  const [sessions, setSessions] = useState([]);
  const [pin, setPin] = useState('');

  useEffect(() => {
    // TODO: Fetch lobby data from Firebase
    // Generate PIN for demo
    setPin(Math.random().toString(36).substring(2, 8).toUpperCase());
  }, [lobbyId]);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Live-Überwachung</h1>
              <p className="text-gray-600 mt-1">PIN: <span className="font-mono font-bold text-lg">{pin}</span></p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Aktive Spieler</p>
              <p className="text-3xl font-bold text-green-600">{sessions.length}</p>
            </div>
          </div>
        </div>

        {/* Sessions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Spielerfortschritt</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Spieler</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Punkte</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Letzter Zugriff</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Noch keine Spieler beigetreten
                  </td>
                </tr>
              ) : (
                sessions.map((session: any) => (
                  <tr key={session.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{session.displayName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{session.score}</td>
                    <td className="px-6 py-4 text-sm">{session.progress}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{"--"}</td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-blue-600 hover:text-blue-700 font-semibold">Details</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Export Buttons */}
        <div className="mt-8 flex gap-4">
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
            📊 CSV exportieren
          </button>
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
            📄 PDF exportieren
          </button>
          <a href="/dashboard" className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg">
            ← Zurück
          </a>
        </div>
      </div>
    </main>
  );
}
