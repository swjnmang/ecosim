'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { createTeacherByAdmin } from '@/lib/auth';
import { School, User } from '@/types/firestore';

export default function SchoolAdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [teachers, setTeachers] = useState<User[]>([]);
  
  // Form state
  const [showCreateTeacherForm, setShowCreateTeacherForm] = useState(false);
  const [showEditSchoolForm, setShowEditSchoolForm] = useState(false);
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [teacherDisplayName, setTeacherDisplayName] = useState('');
  
  // Edit school form
  const [editSchoolName, setEditSchoolName] = useState('');
  const [editNumberOfStudents, setEditNumberOfStudents] = useState('');
  const [editContactEmail, setEditContactEmail] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push('/school-admin/login');
        return;
      }

      // Check if user is school-admin
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists() || userDoc.data()?.role !== 'school-admin') {
        router.push('/');
        return;
      }

      const userData = { id: firebaseUser.uid, ...userDoc.data() } as User;
      setUser(userData);

      // Load school data
      if (userData.schoolId) {
        const schoolDoc = await getDoc(doc(db, 'schools', userData.schoolId));
        if (schoolDoc.exists()) {
          const schoolData = {
            id: schoolDoc.id,
            ...schoolDoc.data(),
            createdAt: schoolDoc.data().createdAt?.toDate(),
            updatedAt: schoolDoc.data().updatedAt?.toDate(),
          } as School;
          setSchool(schoolData);
          setEditSchoolName(schoolData.name);
          setEditNumberOfStudents(schoolData.numberOfStudents.toString());
          setEditContactEmail(schoolData.contactEmail);
        }
        
        // Load teachers
        await loadTeachers(userData.schoolId);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadTeachers = async (schoolId: string) => {
    try {
      const q = query(
        collection(db, 'users'),
        where('schoolId', '==', schoolId),
        where('role', '==', 'teacher')
      );
      const teachersSnapshot = await getDocs(q);
      const teachersData = teachersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        lastLoginAt: doc.data().lastLoginAt?.toDate(),
      })) as User[];
      setTeachers(teachersData);
    } catch (err) {
      console.error('Error loading teachers:', err);
    }
  };

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.schoolId) return;

    setError('');
    setSuccess('');
    setCreating(true);

    try {
      const result = await createTeacherByAdmin({
        email: teacherEmail,
        password: teacherPassword,
        displayName: teacherDisplayName,
        schoolId: user.schoolId,
        createdBy: user.id,
      });

      if (result.success) {
        setSuccess(`Lehrkraft "${teacherEmail}" erfolgreich angelegt!`);
        setShowCreateTeacherForm(false);
        setTeacherEmail('');
        setTeacherPassword('');
        setTeacherDisplayName('');
        await loadTeachers(user.schoolId);
      } else {
        setError(result.error || 'Fehler beim Anlegen der Lehrkraft');
      }
    } catch (err: any) {
      console.error('Error creating teacher:', err);
      setError(`Fehler: ${err.message || 'Unbekannter Fehler'}`);
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!school) return;

    setError('');
    setSuccess('');

    try {
      await updateDoc(doc(db, 'schools', school.id), {
        name: editSchoolName,
        numberOfStudents: parseInt(editNumberOfStudents),
        contactEmail: editContactEmail,
        updatedAt: new Date(),
      });

      setSuccess('Schulinformationen erfolgreich aktualisiert!');
      setShowEditSchoolForm(false);
      
      // Reload school data
      const schoolDoc = await getDoc(doc(db, 'schools', school.id));
      if (schoolDoc.exists()) {
        setSchool({
          id: schoolDoc.id,
          ...schoolDoc.data(),
          createdAt: schoolDoc.data().createdAt?.toDate(),
          updatedAt: schoolDoc.data().updatedAt?.toDate(),
        } as School);
      }
    } catch (err: any) {
      console.error('Error updating school:', err);
      setError(`Fehler: ${err.message || 'Unbekannter Fehler'}`);
    }
  };

  const handleDeleteTeacher = async (teacherId: string, email: string) => {
    if (!confirm(`Möchten Sie die Lehrkraft "${email}" wirklich löschen?`)) {
      return;
    }

    try {
      // Note: This only deletes from Firestore. Firebase Auth user deletion requires admin SDK
      await deleteDoc(doc(db, 'users', teacherId));
      setSuccess(`Lehrkraft "${email}" wurde deaktiviert.`);
      if (user?.schoolId) {
        await loadTeachers(user.schoolId);
      }
    } catch (err: any) {
      console.error('Error deleting teacher:', err);
      setError(`Fehler beim Löschen: ${err.message || 'Unbekannter Fehler'}`);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/school-admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
        <div className="text-white text-xl">Laden...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              🏫 {school?.name || 'Schulverwaltung'}
            </h1>
            <p className="text-gray-300">
              Angemeldet als: {user?.displayName || user?.email}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* School Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/20">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-white">Schulinfo</h2>
                <button
                  onClick={() => setShowEditSchoolForm(!showEditSchoolForm)}
                  className="text-blue-300 hover:text-blue-200 text-sm"
                >
                  {showEditSchoolForm ? '✕' : '✏️ Bearbeiten'}
                </button>
              </div>

              {!showEditSchoolForm ? (
                <div className="space-y-3 text-gray-200">
                  <div>
                    <p className="text-sm text-gray-400">Name</p>
                    <p className="font-semibold">{school?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Schüler/innen</p>
                    <p className="font-semibold">{school?.numberOfStudents}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Kontakt</p>
                    <p className="font-semibold text-sm">{school?.contactEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Lehrkräfte</p>
                    <p className="font-semibold">{teachers.length}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleUpdateSchool} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                      Schulname
                    </label>
                    <input
                      type="text"
                      value={editSchoolName}
                      onChange={(e) => setEditSchoolName(e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                      Anzahl Schüler/innen
                    </label>
                    <input
                      type="number"
                      value={editNumberOfStudents}
                      onChange={(e) => setEditNumberOfStudents(e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                      Kontakt E-Mail
                    </label>
                    <input
                      type="email"
                      value={editContactEmail}
                      onChange={(e) => setEditContactEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all text-sm"
                  >
                    Speichern
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Teachers Management */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Lehrkräfte ({teachers.length})
                </h2>
                {!showCreateTeacherForm && (
                  <button
                    onClick={() => setShowCreateTeacherForm(true)}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all text-sm"
                  >
                    + Lehrkraft anlegen
                  </button>
                )}
              </div>

              {/* Create Teacher Form */}
              {showCreateTeacherForm && (
                <div className="bg-white/5 rounded-lg p-4 border border-white/10 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">Neue Lehrkraft</h3>
                    <button
                      onClick={() => {
                        setShowCreateTeacherForm(false);
                        setError('');
                      }}
                      className="text-gray-300 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleCreateTeacher} className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-1">
                        E-Mail *
                      </label>
                      <input
                        type="email"
                        value={teacherEmail}
                        onChange={(e) => setTeacherEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="lehrer@schule.de"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={teacherDisplayName}
                        onChange={(e) => setTeacherDisplayName(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Max Mustermann"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-1">
                        Passwort * (mind. 6 Zeichen)
                      </label>
                      <input
                        type="password"
                        value={teacherPassword}
                        onChange={(e) => setTeacherPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••••"
                        minLength={6}
                        required
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={creating}
                        className="flex-1 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                      >
                        {creating ? 'Wird angelegt...' : 'Anlegen'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCreateTeacherForm(false)}
                        className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all text-sm"
                      >
                        Abbrechen
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Teachers List */}
              {teachers.length === 0 ? (
                <p className="text-gray-300 text-center py-8">
                  Noch keine Lehrkräfte angelegt.
                </p>
              ) : (
                <div className="space-y-3">
                  {teachers.map((teacher) => (
                    <div
                      key={teacher.id}
                      className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {teacher.displayName || teacher.email}
                          </h3>
                          <p className="text-sm text-gray-300">{teacher.email}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Angelegt: {teacher.createdAt?.toLocaleDateString('de-DE')}
                          </p>
                          {teacher.lastLoginAt && (
                            <p className="text-xs text-gray-400">
                              Letzter Login: {teacher.lastLoginAt.toLocaleDateString('de-DE')}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteTeacher(teacher.id, teacher.email)}
                          className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 text-sm rounded border border-red-500/50 transition-all"
                        >
                          Löschen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
