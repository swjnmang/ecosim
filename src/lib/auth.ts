// src/lib/auth.ts
// Authentifizierungs-Helfer für Lehrer und Schüler

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut as firebaseSignOut,
  User,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { Teacher } from '@/types/firestore';

// ========== LEHRER AUTHENTIFIZIERUNG ==========

/**
 * Registriere einen neuen Lehrer
 */
export async function registerTeacher(
  email: string,
  password: string,
  displayName?: string
): Promise<{ success: boolean; error?: string; teacherId?: string }> {
  try {
    console.log('Starting teacher registration for:', email);
    
    // Firebase Auth User erstellen
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Firebase Auth user created:', user.uid);

    // Display Name setzen (falls angegeben)
    if (displayName) {
      await updateProfile(user, { displayName });
      console.log('Display name set:', displayName);
    }

    // Teacher-Dokument in Firestore erstellen
    const teacherData: Omit<Teacher, 'id'> = {
      email: user.email!,
      displayName: displayName || undefined,
      createdAt: new Date(),
      lastLoginAt: new Date(),
    };

    console.log('Creating Firestore document...');
    await setDoc(doc(db, 'teachers', user.uid), {
      ...teacherData,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });
    console.log('Firestore document created successfully');

    return { success: true, teacherId: user.uid };
  } catch (error: any) {
    console.error('Registration error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    let errorMessage = 'Registrierung fehlgeschlagen';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Diese E-Mail-Adresse wird bereits verwendet';
        break;
      case 'auth/weak-password':
        errorMessage = 'Das Passwort ist zu schwach (mindestens 6 Zeichen)';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Ungültige E-Mail-Adresse';
        break;
      default:
        errorMessage = `Fehler: ${error.message || error.code || 'Unbekannter Fehler'}`;
    }

    return { success: false, error: errorMessage };
  }
}

/**
 * Lehrer-Login
 */
export async function loginTeacher(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; teacherId?: string }> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // lastLoginAt aktualisieren
    await setDoc(
      doc(db, 'teachers', user.uid),
      { lastLoginAt: serverTimestamp() },
      { merge: true }
    );

    return { success: true, teacherId: user.uid };
  } catch (error: any) {
    let errorMessage = 'Login fehlgeschlagen';
    
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        errorMessage = 'E-Mail oder Passwort falsch';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Ungültige E-Mail-Adresse';
        break;
      case 'auth/user-disabled':
        errorMessage = 'Dieser Account wurde deaktiviert';
        break;
    }

    return { success: false, error: errorMessage };
  }
}

/**
 * Hole Lehrer-Daten
 */
export async function getTeacherData(teacherId: string): Promise<Teacher | null> {
  try {
    const teacherDoc = await getDoc(doc(db, 'teachers', teacherId));
    if (!teacherDoc.exists()) return null;

    return {
      id: teacherDoc.id,
      ...teacherDoc.data(),
    } as Teacher;
  } catch (error) {
    console.error('Fehler beim Laden der Lehrer-Daten:', error);
    return null;
  }
}

// ========== SCHÜLER (ANONYM) ==========

/**
 * Anonymer Login für Schüler
 */
export async function loginStudentAnonymous(): Promise<{ success: boolean; error?: string; uid?: string }> {
  try {
    const userCredential = await signInAnonymously(auth);
    return { success: true, uid: userCredential.user.uid };
  } catch (error: any) {
    return { success: false, error: 'Anonymer Login fehlgeschlagen' };
  }
}

// ========== ALLGEMEIN ==========

/**
 * Logout (für Lehrer und Schüler)
 */
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

/**
 * Prüfe, ob der aktuelle User ein Lehrer ist
 */
export async function isTeacher(user: User | null): Promise<boolean> {
  if (!user) return false;
  if (user.isAnonymous) return false;

  try {
    const teacherDoc = await getDoc(doc(db, 'teachers', user.uid));
    return teacherDoc.exists();
  } catch {
    return false;
  }
}

/**
 * Hole den aktuell eingeloggten User
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Passwort zurücksetzen
 */
export async function resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { sendPasswordResetEmail } = await import('firebase/auth');
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    let errorMessage = 'Passwort-Reset fehlgeschlagen';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'Kein Account mit dieser E-Mail gefunden';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Ungültige E-Mail-Adresse';
        break;
    }

    return { success: false, error: errorMessage };
  }
}
