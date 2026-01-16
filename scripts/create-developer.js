/**
 * Script zum Erstellen eines Developer-Accounts
 * 
 * Verwendung:
 * node scripts/create-developer.js
 * 
 * Die Service Account Key muss in der Datei gespeichert sein
 */

const admin = require('firebase-admin');
const path = require('path');

// Service Account Key laden (muss im Projektroot sein)
const serviceAccountPath = path.join(__dirname, '../ecosim-751ae-firebase-adminsdk-fbsvc-d2334e8c7b.json');
const serviceAccount = require(serviceAccountPath);

// Firebase Admin SDK initialisieren
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'ecosim-751ae'
});

const db = admin.firestore();
const auth = admin.auth();

// Developer-Informationen
const DEVELOPER_EMAIL = 'developer@ecosim.local';
const DEVELOPER_PASSWORD = 'Developer@12345';
const DEVELOPER_NAME = 'EcoSim Developer';

async function createDeveloper() {
  try {
    console.log('🔧 Starte Developer-Account Erstellung...\n');

    // 1. Firebase Auth User erstellen
    console.log(`📝 Erstelle Firebase Auth User mit E-Mail: ${DEVELOPER_EMAIL}`);
    const userRecord = await auth.createUser({
      email: DEVELOPER_EMAIL,
      password: DEVELOPER_PASSWORD,
      displayName: DEVELOPER_NAME,
      emailVerified: false
    });
    console.log(`✅ Firebase Auth User erstellt!`);
    console.log(`   UID: ${userRecord.uid}\n`);

    // 2. Firestore User Document erstellen
    console.log(`📄 Erstelle Firestore User Document...`);
    const now = new Date();
    
    await db.collection('users').doc(userRecord.uid).set({
      email: DEVELOPER_EMAIL,
      displayName: DEVELOPER_NAME,
      role: 'developer',
      createdAt: admin.firestore.Timestamp.fromDate(now),
      lastLoginAt: admin.firestore.Timestamp.fromDate(now)
    });
    console.log(`✅ Firestore User Document erstellt!\n`);

    // Erfolgsmeldung
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ Developer-Account erfolgreich erstellt!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n📧 E-Mail: ${DEVELOPER_EMAIL}`);
    console.log(`🔐 Passwort: ${DEVELOPER_PASSWORD}`);
    console.log(`👤 Name: ${DEVELOPER_NAME}`);
    console.log(`🆔 UID: ${userRecord.uid}`);
    console.log(`\n🌐 Login URL: http://localhost:3000/developer/login`);
    console.log(`\n💡 Passwort später ändern: In Firebase Console → Authentication → User auswählen\n`);

  } catch (error) {
    console.error('❌ Fehler beim Erstellen des Developer-Accounts:');
    console.error(error);
    process.exit(1);
  }

  // Firebase App beenden
  admin.app().delete();
  console.log('Done!');
  process.exit(0);
}

// Script ausführen
createDeveloper();
