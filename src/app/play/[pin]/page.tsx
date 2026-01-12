'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function PlayPage() {
  const params = useParams();
  const pin = params.pin as string;
  const [activeProgram, setActiveProgram] = useState<string | null>(null);
  const playerName = typeof window !== 'undefined' 
    ? localStorage.getItem('playerName') || 'Spieler'
    : 'Spieler';

  const programs = [
    { id: 'mail', name: '✉️ E-Mail', icon: '✉️' },
    { id: 'textverarbeitung', name: '📝 Textverarbeitung', icon: '📝' },
    { id: 'lager', name: '📦 Lager', icon: '📦' },
    { id: 'produktkatalog', name: '🛍️ Katalog', icon: '🛍️' },
    { id: 'buchung', name: '💰 Buchung', icon: '💰' },
    { id: 'banking', name: '🏦 Banking', icon: '🏦' },
  ];

  return (
    <main className="min-h-screen bg-gray-200 p-4">
      {/* Taskbar */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-gray-800 border-t border-gray-700 flex items-center px-4 gap-2 overflow-x-auto">
        {programs.map((prog) => (
          <button
            key={prog.id}
            onClick={() => setActiveProgram(activeProgram === prog.id ? null : prog.id)}
            className={`px-4 py-2 rounded font-semibold transition whitespace-nowrap ${
              activeProgram === prog.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
          >
            {prog.icon} {prog.name}
          </button>
        ))}
      </div>

      {/* Desktop Icons */}
      {!activeProgram && (
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-8 p-8">
          {programs.map((prog) => (
            <button
              key={prog.id}
              onClick={() => setActiveProgram(prog.id)}
              className="flex flex-col items-center gap-2 hover:bg-blue-300 hover:bg-opacity-30 p-4 rounded transition"
            >
              <div className="text-5xl">{prog.icon}</div>
              <span className="text-sm text-gray-800 font-semibold text-center">{prog.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Windows - Program Contents */}
      {activeProgram && (
        <div className="fixed top-8 left-8 right-8 bottom-24 bg-white rounded-lg shadow-2xl flex flex-col border-2 border-gray-400">
          {/* Window Title Bar */}
          <div className="h-10 bg-gradient-to-r from-blue-600 to-blue-500 text-white flex items-center justify-between px-4 rounded-t-lg cursor-move">
            <span className="font-semibold">
              {programs.find((p) => p.id === activeProgram)?.name}
            </span>
            <button
              onClick={() => setActiveProgram(null)}
              className="text-xl hover:text-gray-200 font-bold"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6 bg-gray-50">
            {activeProgram === 'mail' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Posteingang</h2>
                <div className="space-y-3">
                  <div className="p-4 bg-white border border-gray-200 rounded hover:shadow transition cursor-pointer">
                    <p className="font-semibold text-gray-900">Chef: Bestelle Artikel XY</p>
                    <p className="text-sm text-gray-600 mt-1">Bitte bestelle 100 Einheiten Artikel XY zum Einkaufspreis von 50 EUR...</p>
                  </div>
                  <div className="p-4 bg-white border border-gray-200 rounded hover:shadow transition cursor-pointer">
                    <p className="font-semibold text-gray-900">Kunde: Anfrage für Ware</p>
                    <p className="text-sm text-gray-600 mt-1">Wir möchten gerne 50 Einheiten des Produkts XY bestellen...</p>
                  </div>
                </div>
              </div>
            )}

            {activeProgram === 'lager' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Lagerbestände</h2>
                <table className="w-full text-sm">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left">Artikel</th>
                      <th className="px-4 py-2 text-left">Menge</th>
                      <th className="px-4 py-2 text-left">Preis</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-4 py-2">Artikel A</td>
                      <td className="px-4 py-2">500</td>
                      <td className="px-4 py-2">25,00 EUR</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2">Artikel B</td>
                      <td className="px-4 py-2">250</td>
                      <td className="px-4 py-2">45,00 EUR</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeProgram === 'buchung' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Buchungsjournal</h2>
                <p className="text-gray-600 mb-6">Erstelle deine Buchungssätze hier basierend auf dem IKR Kontenrahmen.</p>
                <div className="bg-white p-4 border border-gray-200 rounded">
                  <p className="text-gray-600">Noch keine Buchungen vorhanden.</p>
                </div>
              </div>
            )}

            {!['mail', 'lager', 'buchung'].includes(activeProgram) && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {programs.find((p) => p.id === activeProgram)?.name}
                </h2>
                <p className="text-gray-600">Programm wird noch entwickelt...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Info Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-6 bg-gray-600 text-white text-xs flex items-center px-4 justify-between">
        <span>Spieler: {playerName}</span>
        <span>Punkte: 0 | Budget: 50.000 EUR</span>
      </div>
    </main>
  );
}
