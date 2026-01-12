'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Implement Firebase Authentication
      // For MVP, just store locally and redirect
      localStorage.setItem('teacherId', 'teacher_' + email);
      localStorage.setItem('teacherEmail', email);
      router.push('/dashboard');
    } catch (err) {
      setError('Authentifizierungsfehler. Bitte versuchen Sie es später erneut.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-emerald-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Lehrkraft-Anmeldung
        </h1>
        <p className="text-gray-600 text-center mb-6 text-sm">
          Verwalte deine Lobbys und überwache deine Schüler
        </p>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              E-Mail-Adresse
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.de"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Passwort
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
          >
            {loading ? 'Wird angemeldet...' : isSignup ? 'Registrieren' : 'Anmelden'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-3">
            {isSignup ? 'Hast du bereits ein Konto?' : 'Noch kein Konto?'}
          </p>
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-green-600 hover:text-green-700 font-semibold text-sm"
          >
            {isSignup ? 'Anmelden' : 'Registrieren'}
          </button>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-gray-600 hover:text-gray-700 text-sm">
            ← Zurück zur Startseite
          </a>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 max-w-xs p-4 bg-blue-50 rounded text-xs text-gray-600">
        <p className="font-semibold mb-2">📋 Datenschutz:</p>
        <p>
          Diese Anwendung ist DSGVO-konform und speichert deine Daten nur zur Verwaltung
          deiner Lobbys. Kein Tracking, keine Weitergabe an Dritte.
        </p>
      </div>
    </main>
  );
}
