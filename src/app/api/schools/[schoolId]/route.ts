import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
let db: any;
let auth: any;

try {
  // Check if serviceAccountKey exists via environment variable
  if (process.env.FIREBASE_ADMIN_SDK_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_KEY);
    
    if (!getApps().length) {
      initializeApp({
        credential: cert(serviceAccount),
      });
    }
    
    db = getFirestore();
    auth = getAuth();
  }
} catch (error: any) {
  console.warn('Firebase Admin SDK not fully initialized:', error.message);
  console.warn('API routes may not work properly in development without FIREBASE_ADMIN_SDK_KEY environment variable');
}

/**
 * GET /api/schools/[schoolId]
 * Hole Schuldaten
 */
export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    const { schoolId } = await context.params;

    if (!db) {
      return NextResponse.json(
        { error: 'Server nicht konfiguriert - Firebase Admin SDK fehlt' },
        { status: 500 }
      );
    }

    // Get school data
    const schoolDoc = await db.collection('schools').doc(schoolId).get();

    if (!schoolDoc.exists) {
      return NextResponse.json(
        { error: 'Schule nicht gefunden' },
        { status: 404 }
      );
    }

    const data = schoolDoc.data();
    return NextResponse.json({
      id: schoolDoc.id,
      ...data,
      createdAt: data?.createdAt?.toDate?.() || data?.createdAt,
      updatedAt: data?.updatedAt?.toDate?.() || data?.updatedAt,
    });
  } catch (error: any) {
    console.error('Error fetching school:', error);
    return NextResponse.json(
      { error: error.message || 'Fehler beim Abrufen der Schule' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/schools/[schoolId]
 * Aktualisiere Schuldaten (Developer only)
 */
export async function PUT(
  request: NextRequest,
  context: any
) {
  try {
    const { schoolId } = await context.params;

    if (!db || !auth) {
      return NextResponse.json(
        { error: 'Server nicht konfiguriert - Firebase Admin SDK fehlt' },
        { status: 500 }
      );
    }

    // Verify developer token (basic check)
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentifizierung erforderlich' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Verify token with Firebase
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(token);
    } catch (error) {
      return NextResponse.json(
        { error: 'Ungültiges Token' },
        { status: 401 }
      );
    }

    // Check if user is developer
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    if (!userDoc.exists || userDoc.data()?.role !== 'developer') {
      return NextResponse.json(
        { error: 'Nur Entwickler können Schulen bearbeiten' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validiere Input
    const { name, numberOfStudents, contactEmail } = body;

    if (!name || !contactEmail) {
      return NextResponse.json(
        { error: 'Schulname und Kontakt-E-Mail erforderlich' },
        { status: 400 }
      );
    }

    // Update school
    const updateData = {
      name,
      numberOfStudents: parseInt(numberOfStudents) || 0,
      contactEmail,
      updatedAt: Timestamp.now(),
    };

    await db.collection('schools').doc(schoolId).update(updateData);

    return NextResponse.json({
      success: true,
      message: 'Schule aktualisiert',
      data: {
        id: schoolId,
        ...updateData,
        updatedAt: new Date(updateData.updatedAt.toMillis()),
      },
    });
  } catch (error: any) {
    console.error('Error updating school:', error);
    return NextResponse.json(
      { error: error.message || 'Fehler beim Aktualisieren der Schule' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/schools/[schoolId]
 * Lösche Schule und alle zugehörigen Daten (Developer only)
 */
export async function DELETE(
  request: NextRequest,
  context: any
) {
  try {
    const { schoolId } = await context.params;

    if (!db || !auth) {
      return NextResponse.json(
        { error: 'Server nicht konfiguriert - Firebase Admin SDK fehlt' },
        { status: 500 }
      );
    }

    // Verify developer token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentifizierung erforderlich' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Verify token with Firebase
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(token);
    } catch (error) {
      return NextResponse.json(
        { error: 'Ungültiges Token' },
        { status: 401 }
      );
    }

    // Check if user is developer
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    if (!userDoc.exists || userDoc.data()?.role !== 'developer') {
      return NextResponse.json(
        { error: 'Nur Entwickler können Schulen löschen' },
        { status: 403 }
      );
    }

    // Get school admin ID
    const schoolDoc = await db.collection('schools').doc(schoolId).get();
    if (!schoolDoc.exists) {
      return NextResponse.json(
        { error: 'Schule nicht gefunden' },
        { status: 404 }
      );
    }

    const adminId = schoolDoc.data()?.adminId;

    // Delete related data using batch operations
    const batch = db.batch();

    // 1. Get all users (teachers) with this schoolId
    const usersSnapshot = await db.collection('users')
      .where('schoolId', '==', schoolId)
      .get();

    // Delete all teachers for this school
    usersSnapshot.docs.forEach((doc: any) => {
      batch.delete(doc.ref);
      // Also try to delete Firebase Auth user
      auth.deleteUser(doc.id).catch(() => {
        // User might already be deleted
      });
    });

    // 2. Delete school admin user
    if (adminId) {
      const adminUserDoc = await db.collection('users').doc(adminId).get();
      if (adminUserDoc.exists) {
        batch.delete(adminUserDoc.ref);
        auth.deleteUser(adminId).catch(() => {
          // User might already be deleted
        });
      }
    }

    // 3. Delete school document
    batch.delete(db.collection('schools').doc(schoolId));

    // Commit batch
    await batch.commit();

    return NextResponse.json({
      success: true,
      message: 'Schule und alle zugehörigen Daten gelöscht',
    });
  } catch (error: any) {
    console.error('Error deleting school:', error);
    return NextResponse.json(
      { error: error.message || 'Fehler beim Löschen der Schule' },
      { status: 500 }
    );
  }
}
