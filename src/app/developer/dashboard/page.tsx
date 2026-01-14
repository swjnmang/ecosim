'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { createSchoolWithAdmin } from '@/lib/auth';
import { School, User } from '@/types/firestore';

export default function DeveloperDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [schools, setSchools] = useState<School[]>([]);
  
  // Form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [schoolName, setSchoolName] = useState('');
  const [numberOfStudents, setNumberOfStudents] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminDisplayName, setAdminDisplayName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push('/developer/login');
        return;
      }

      // Check if user is developer
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists() || userDoc.data()?.role !== 'developer') {
        router.push('/');
        return;
      }

      setUser({ id: firebaseUser.uid, ...userDoc.data() } as User);
      await loadSchools();
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadSchools = async () => {
    try {
      const schoolsSnapshot = await getDocs(collection(db, 'schools'));
      const schoolsData = schoolsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as School[];
      setSchools(schoolsData);
    } catch (err) {
      console.error('Error loading schools:', err);
    }
  };

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setCreating(true);

    try {
      const result = await createSchoolWithAdmin({
        schoolName,
        numberOfStudents: parseInt(numberOfStudents),
        contactEmail,
        adminEmail,
        adminPassword,
        adminDisplayName,
      });

      if (result.success) {
        setSuccess(`Schule "${schoolName}" erfolgreich angelegt! Admin-Login: ${adminEmail}`);
        setShowCreateForm(false);
        // Reset form
        setSchoolName('');
        setNumberOfStudents('');
        setContactEmail('');
        setAdminEmail('');
        setAdminPassword('');
        setAdminDisplayName('');
        // Reload schools
        await loadSchools();
      } else {
        setError(result.error || 'Fehler beim Anlegen der Schule');
      }
    } catch (err: any) {
      console.error('Error creating school:', err);
      setError(`Fehler: ${err.message || 'Unbekannter Fehler'}`);
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/developer/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-xl">Laden...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              🔧 Developer Dashboard
            </h1>
            <p className="text-gray-300">
              Angemeldet als: {user?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg border border-red-500/50 transition-all"
          >
            Abmelden
          </button>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200">
            {success}
          </div>
        )}

        {/* Create School Button */}
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="mb-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            + Neue Schule anlegen
          </button>
        )}

        {/* Create School Form */}
        {showCreateForm && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Neue Schule anlegen</h2>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setError('');
                }}
                className="text-gray-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSchool} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Schulname *
                  </label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="z.B. Gymnasium Musterstadt"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Anzahl Schüler/innen *
                  </label>
                  <input
                    type="number"
                    value={numberOfStudents}
                    onChange={(e) => setNumberOfStudents(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="z.B. 500"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Kontakt E-Mail (Schule) *
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="kontakt@schule.de"
                  required
                />
              </div>

              <hr className="border-white/20 my-6" />
              <h3 className="text-lg font-semibold text-white mb-4">Schuladmin-Account</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Admin E-Mail *
                  </label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="admin@schule.de"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Admin Name
                  </label>
                  <input
                    type="text"
                    value={adminDisplayName}
                    onChange={(e) => setAdminDisplayName(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Max Mustermann"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Admin Passwort * (mind. 6 Zeichen)
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {creating ? 'Wird angelegt...' : 'Schule anlegen'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setError('');
                  }}
                  className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                >
                  Abbrechen
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Schools List */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">
            Registrierte Schulen ({schools.length})
          </h2>

          {schools.length === 0 ? (
            <p className="text-gray-300">Noch keine Schulen angelegt.</p>
          ) : (
            <div className="space-y-4">
              {schools.map((school) => (
                <div
                  key={school.id}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {school.name}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-300">
                        <p>📊 Schüler/innen: {school.numberOfStudents}</p>
                        <p>📧 Kontakt: {school.contactEmail}</p>
                        <p>🆔 Admin ID: {school.adminId}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          Angelegt: {school.createdAt?.toLocaleDateString('de-DE')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
