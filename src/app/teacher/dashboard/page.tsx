'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { signOut, isTeacher } from '@/lib/auth';
import { generateLobbyPin, formatPin } from '@/lib/pinGenerator';
import type { Lobby } from '@/types/firestore';

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [teacherName, setTeacherName] = useState('');
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newLobbyName, setNewLobbyName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/teacher/login');
        return;
      }

      const teacher = await isTeacher(user);
      if (!teacher) {
        router.push('/teacher/login');
        return;
      }

      setTeacherName(user.displayName || user.email || 'Lehrkraft');
      await loadLobbies(user.uid);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadLobbies = async (teacherId: string) => {
    const lobbiesRef = collection(db, 'lobbies');
    const q = query(lobbiesRef, where('teacherId', '==', teacherId));
    const snapshot = await getDocs(q);
    const lobbiesData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Lobby[];
    const getMs = (value: any) => {
      if (!value) return 0;
      if (value instanceof Date) return value.getTime();
      if (typeof value.toMillis === 'function') return value.toMillis();
      if (typeof value.seconds === 'number') return value.seconds * 1000;
      return 0;
    };

    setLobbies(
      lobbiesData.sort((a, b) => getMs(b.createdAt) - getMs(a.createdAt))
    );
  };

  const handleCreateLobby = async () => {
    if (!newLobbyName.trim() || !auth.currentUser) return;

    setCreating(true);
    try {
      const pin = generateLobbyPin();
      const newLobby: Omit<Lobby, 'id'> = {
        name: newLobbyName.trim(),
        pin,
        teacherId: auth.currentUser.uid,
        status: 'active',
        config: {
          enabledModules: {
            einkauf: true,
            verkauf: true,
            marketing: false,
            controlling: false,
            finanzen: false,
            kaufvertragsstoerungen: false,
          },
          examMode: false,
          allowTeamwork: true,
        },
        createdAt: serverTimestamp() as any,
        updatedAt: serverTimestamp() as any,
      };

      const docRef = await addDoc(collection(db, 'lobbies'), newLobby);
      await loadLobbies(auth.currentUser.uid);
      setShowCreateModal(false);
      setNewLobbyName('');
      router.push(`/teacher/lobby/${docRef.id}`);
    } catch (error) {
      console.error('Error creating lobby:', error);
      alert('Fehler beim Erstellen der Lobby');
    } finally {
      setCreating(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Eco<span className="text-indigo-600">Sim</span> Dashboard
            </h1>
            <p className="text-sm text-gray-600">Willkommen, {teacherName}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
          >
            Abmelden
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Actions */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Meine Lobbys</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
          >
            + Neue Lobby erstellen
          </button>
        </div>

        {/* Lobbies Grid */}
        {lobbies.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Noch keine Lobbys
            </h3>
            <p className="text-gray-600 mb-6">
              Erstelle deine erste Lobby, um mit deinen Schülern zu starten.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
            >
              Jetzt Lobby erstellen
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lobbies.map((lobby) => (
              <div
                key={lobby.id}
                onClick={() => router.push(`/teacher/lobby/${lobby.id}`)}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {lobby.name}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      lobby.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {lobby.status === 'active' ? 'Aktiv' : 'Archiviert'}
                  </span>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-600">PIN:</span>
                    <span className="text-2xl font-bold text-indigo-600 tracking-wider">
                      {formatPin(lobby.pin)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Erstellt:</span>
                    <span>
                      {lobby.createdAt
                        ? new Date(lobby.createdAt.toDate()).toLocaleDateString('de-DE')
                        : 'Unbekannt'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Lobby Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Neue Lobby erstellen
            </h3>
            
            <div className="mb-6">
              <label htmlFor="lobbyName" className="block text-sm font-medium text-gray-700 mb-2">
                Lobby-Name
              </label>
              <input
                id="lobbyName"
                type="text"
                value={newLobbyName}
                onChange={(e) => setNewLobbyName(e.target.value)}
                placeholder="z.B. Klasse 10a 2024/25"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                autoFocus
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Hinweis:</strong> Nach dem Erstellen erhältst du einen PIN-Code, den deine Schüler zum Beitreten benötigen.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewLobbyName('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={creating}
              >
                Abbrechen
              </button>
              <button
                onClick={handleCreateLobby}
                disabled={!newLobbyName.trim() || creating}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? 'Erstelle...' : 'Erstellen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
