'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { loginStudentAnonymous } from '@/lib/auth';
import { formatPin } from '@/lib/pinGenerator';
import type { Lobby, PlayerSession } from '@/types/firestore';

export default function JoinPage() {
  const [pin, setPin] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!pin.trim()) {
      setError('Bitte PIN eingeben');
      return;
    }

    if (!displayName.trim()) {
      setError('Bitte Namen eingeben');
      return;
    }

    if (displayName.trim().length < 2) {
      setError('Name muss mindestens 2 Zeichen lang sein');
      return;
    }

    setLoading(true);

    try {
      // PIN normalisieren (Großbuchstaben, ohne Leerzeichen)
      const normalizedPin = pin.replace(/\s/g, '').toUpperCase();

      // Lobby mit PIN suchen
      const lobbiesRef = collection(db, 'lobbies');
      const q = query(
        lobbiesRef,
        where('pin', '==', normalizedPin),
        where('status', '==', 'active')
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError('Lobby nicht gefunden. Bitte PIN überprüfen.');
        setLoading(false);
        return;
      }

      const lobbyDoc = snapshot.docs[0];
      const lobby = { id: lobbyDoc.id, ...lobbyDoc.data() } as Lobby;

      // Schüler anonym anmelden
      const user = await loginStudentAnonymous();

      // PlayerSession erstellen
      const playerSession: Omit<PlayerSession, 'id'> = {
        userId: user.uid,
        lobbyId: lobby.id,
        companyId: '', // Wird später beim Unternehmen erstellen gesetzt
        ownerUid: user.uid,
        anonPlayerCode: user.uid.slice(0, 8),
        displayName: displayName.trim(),
        role: 'Auszubildender',
        experience: 0,
        level: 1,
        badges: [],
        progress: 'onboarding',
        skills: {
          einkauf: 0,
          verkauf: 0,
          kalkulation: 0,
          buchung: 0,
          marketing: 0,
        },
        lastActiveAt: new Date(),
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'playerSessions'), playerSession);

      // Zur Spiel-Seite weiterleiten
      router.push(`/play/${lobby.pin}`);
    } catch (err: any) {
      console.error('Join error:', err);
      setError(err.message || 'Fehler beim Beitreten');
      setLoading(false);
    }
  };

  const handlePinInput = (value: string) => {
    // Nur Buchstaben und Zahlen erlauben, max 6 Zeichen
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6);
    setPin(cleaned);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Lobby beitreten
          </h1>
        </div>

        <form onSubmit={handleJoin} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
              Lobby-PIN
            </label>
            <input
              type="text"
              id="pin"
              value={formatPin(pin)}
              onChange={(e) => handlePinInput(e.target.value)}
              placeholder="AB12CD"
              maxLength={7}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-bold tracking-wider focus:ring-2 focus:ring-green-500 focus:border-transparent uppercase"
              required
              autoComplete="off"
            />
            <p className="text-xs text-gray-500 mt-1">6-stelliger Code von deiner Lehrkraft</p>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Dein Name
            </label>
            <input
              type="text"
              id="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value.slice(0, 20))}
              placeholder="z.B. Max M."
              maxLength={20}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Wird anderen Spielern angezeigt (max. 20 Zeichen)</p>
          </div>

          <button
            type="submit"
            disabled={loading || !pin.trim() || !displayName.trim()}
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
          >
            {loading ? 'Trete bei...' : 'Beitreten'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-2">Bist du eine Lehrkraft?</p>
          <a href="/teacher/login" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            Zum Lehrer-Login →
          </a>
        </div>

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            <strong>Datenschutz:</strong> Du bleibst anonym. Wir speichern nur deinen Namen und Spielfortschritt.
          </p>
        </div>
      </div>
    </main>
  );
}
