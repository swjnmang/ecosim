// src/lib/auth.ts
// Authentifizierungs-Helfer für Lehrer und Schüler

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, addDoc, collection } from 'firebase/firestore';
import { auth, db } from './firebase';
import { Teacher, User, School } from '@/types/firestore';

// ========== LEHRER AUTHENTIFIZIERUNG ==========

/**
 * Registriere einen neuen Lehrer
 * @deprecated Use createTeacherByAdmin instead
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
    const teacherData: Omit<User, 'id'> = {
      email: user.email!,
      displayName: displayName || undefined,
      role: 'teacher',
      isLegacy: true, // Mark as legacy since this is old registration method
      createdAt: new Date(),
      lastLoginAt: new Date(),
    };

    console.log('Creating Firestore document...');
    await setDoc(doc(db, 'users', user.uid), {
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
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error: any) {
    console.error('Sign out error:', error);
    return { success: false, error: 'Abmeldung fehlgeschlagen' };
  }
}

/**
 * Prüfe, ob der aktuelle User ein Lehrer ist
 */
export async function isTeacher(user: FirebaseUser | null): Promise<boolean> {
  if (!user) return false;
  if (user.isAnonymous) return false;

  try {
    // Check new users collection
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists() && userDoc.data()?.role === 'teacher') {
      return true;
    }
    
    // Check legacy teachers collection
    const teacherDoc = await getDoc(doc(db, 'teachers', user.uid));
    return teacherDoc.exists();
  } catch {
    return false;
  }
}

/**
 * Hole den aktuell eingeloggten User
 */
export function getCurrentUser(): FirebaseUser | null {
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

// ========== DEVELOPER FUNCTIONS ==========

/**
 * Developer Login
 */
export async function loginDeveloper(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; userId?: string }> {
  try {
    console.log('Developer login attempt for email:', email);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Firebase auth successful, UID:', user.uid);

    // Check if user is developer
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    console.log('Firestore document exists:', userDoc.exists());
    
    if (!userDoc.exists()) {
      console.error('User document does not exist in Firestore');
      await firebaseSignOut(auth);
      return { success: false, error: 'Benutzerdokument nicht gefunden' };
    }
    
    const userData = userDoc.data();
    console.log('User role:', userData?.role);
    
    if (userData?.role !== 'developer') {
      console.error('User is not a developer, role is:', userData?.role);
      await firebaseSignOut(auth);
      return { success: false, error: 'Keine Entwickler-Berechtigung' };
    }

    // Update lastLoginAt
    await setDoc(
      doc(db, 'users', user.uid),
      { lastLoginAt: serverTimestamp() },
      { merge: true }
    );
    console.log('Developer login successful');

    return { success: true, userId: user.uid };
  } catch (error: any) {
    console.error('Developer login error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    let errorMessage = 'Login fehlgeschlagen';
    
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        errorMessage = 'E-Mail oder Passwort falsch';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Ungültige E-Mail-Adresse';
        break;
      case 'permission-denied':
        errorMessage = 'Firestore Zugriff verweigert - überprüfe die Security Rules';
        break;
    }

    return { success: false, error: errorMessage };
  }
}

/**
 * Create School with Admin Account
 */
export async function createSchoolWithAdmin({
  schoolName,
  numberOfStudents,
  contactEmail,
  adminEmail,
  adminPassword,
  adminDisplayName,
}: {
  schoolName: string;
  numberOfStudents: number;
  contactEmail: string;
  adminEmail: string;
  adminPassword: string;
  adminDisplayName?: string;
}): Promise<{ success: boolean; error?: string; schoolId?: string; adminId?: string }> {
  try {
    // Create Firebase Auth user for admin
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const adminUser = userCredential.user;

    // Set display name if provided
    if (adminDisplayName) {
      await updateProfile(adminUser, { displayName: adminDisplayName });
    }

    // Create school document first (without adminId)
    const schoolDocRef = await addDoc(collection(db, 'schools'), {
      name: schoolName,
      numberOfStudents,
      contactEmail,
      adminId: adminUser.uid, // Add admin ID
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Create admin user document
    await setDoc(doc(db, 'users', adminUser.uid), {
      email: adminEmail,
      displayName: adminDisplayName || undefined,
      role: 'school-admin',
      schoolId: schoolDocRef.id,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });

    // Sign out the newly created admin (so developer stays logged in)
    await firebaseSignOut(auth);

    return { 
      success: true, 
      schoolId: schoolDocRef.id,
      adminId: adminUser.uid 
    };
  } catch (error: any) {
    console.error('Error creating school with admin:', error);
    
    let errorMessage = 'Fehler beim Anlegen der Schule';
    
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

// ========== SCHOOL ADMIN FUNCTIONS ==========

/**
 * School Admin Login
 */
export async function loginSchoolAdmin(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; userId?: string }> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if user is school-admin
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists() || userDoc.data()?.role !== 'school-admin') {
      await firebaseSignOut(auth);
      return { success: false, error: 'Keine Schuladmin-Berechtigung' };
    }

    // Update lastLoginAt
    await setDoc(
      doc(db, 'users', user.uid),
      { lastLoginAt: serverTimestamp() },
      { merge: true }
    );

    return { success: true, userId: user.uid };
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
    }

    return { success: false, error: errorMessage };
  }
}

/**
 * Create Teacher by School Admin
 */
export async function createTeacherByAdmin({
  email,
  password,
  displayName,
  schoolId,
  createdBy,
}: {
  email: string;
  password: string;
  displayName?: string;
  schoolId: string;
  createdBy: string;
}): Promise<{ success: boolean; error?: string; teacherId?: string }> {
  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const teacherUser = userCredential.user;

    // Set display name if provided
    if (displayName) {
      await updateProfile(teacherUser, { displayName });
    }

    // Create teacher user document
    await setDoc(doc(db, 'users', teacherUser.uid), {
      email,
      displayName: displayName || undefined,
      role: 'teacher',
      schoolId,
      createdBy,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });

    // Sign out the newly created teacher (so admin stays logged in)
    await firebaseSignOut(auth);

    return { success: true, teacherId: teacherUser.uid };
  } catch (error: any) {
    console.error('Error creating teacher:', error);
    
    let errorMessage = 'Fehler beim Anlegen der Lehrkraft';
    
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

// ========== PROFIL-VERWALTUNG ==========

/**
 * Ändere das Passwort des aktuellen Benutzers
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      return { success: false, error: 'Kein Nutzer angemeldet' };
    }

    // Re-authenticate user with current password
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Change password
    await updatePassword(user, newPassword);
    console.log('Password updated successfully');

    return { success: true };
  } catch (error: any) {
    console.error('Password change error:', error);
    let errorMessage = 'Passwortänderung fehlgeschlagen';

    switch (error.code) {
      case 'auth/wrong-password':
        errorMessage = 'Aktuelles Passwort ist falsch';
        break;
      case 'auth/weak-password':
        errorMessage = 'Neues Passwort ist zu schwach (mindestens 6 Zeichen)';
        break;
      case 'auth/requires-recent-login':
        errorMessage = 'Bitte melde dich erneut an, um dein Passwort zu ändern';
        break;
    }

    return { success: false, error: errorMessage };
  }
}

/**
 * Aktualisiere das Benutzerprofil
 */
export async function updateUserProfile(
  displayName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'Kein Nutzer angemeldet' };
    }

    await updateProfile(user, { displayName });

    // Also update Firestore document
    await setDoc(
      doc(db, 'users', user.uid),
      { displayName, lastUpdatedAt: serverTimestamp() },
      { merge: true }
    );

    return { success: true };
  } catch (error: any) {
    console.error('Profile update error:', error);
    return { success: false, error: 'Profilaktualisierung fehlgeschlagen' };
  }
}

/**
 * Rufe das aktuelle Benutzerprofil ab
 */
export async function getCurrentUserProfile(): Promise<{
  success: boolean;
  user?: any;
  error?: string;
}> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'Kein Nutzer angemeldet' };
    }

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      return { success: false, error: 'Benutzerdokument nicht gefunden' };
    }

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || userDoc.data()?.displayName,
        role: userDoc.data()?.role,
        createdAt: userDoc.data()?.createdAt,
      },
    };
  } catch (error: any) {
    console.error('Get user profile error:', error);
    return { success: false, error: 'Fehler beim Abrufen des Profils' };
  }
}

// ========== LEGACY TEACHER FUNCTIONS (Keep for backwards compatibility) =========
