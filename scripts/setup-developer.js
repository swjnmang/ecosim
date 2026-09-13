#!/usr/bin/env node

/**
 * Setup Script für Developer-Account
 * 
 * Dieses Script hilft dir, einen Entwickler-Account zu erstellen.
 * Es gibt dir mehrere Optionen je nach deinem Setup.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('\n🔧 EcoSim Developer Account Setup\n');
  console.log('═══════════════════════════════════════════\n');

  console.log('Ich helfe dir, einen Developer-Account zu erstellen.\n');
  console.log('Du hast zwei Optionen:\n');
  console.log('1️⃣  Automatisch (mit Firebase Admin SDK)');
  console.log('   - Benötigt: Firebase Service Account JSON\n');
  console.log('2️⃣  Manuell (über Firebase Console)');
  console.log('   - Keine Dateien nötig, aber etwas mehr Handarbeit\n');

  const choice = await question('Welche Option möchtest du? (1 oder 2): ');

  if (choice === '1') {
    await setupAutomatic();
  } else if (choice === '2') {
    await setupManual();
  } else {
    console.log('❌ Ungültige Eingabe!');
    rl.close();
    process.exit(1);
  }
}

async function setupAutomatic() {
  console.log('\n📋 Automatisches Setup\n');
  
  // Check für Service Account Datei
  const serviceAccountPath = path.join(__dirname, '../ecosim-751ae-firebase-adminsdk-fbsvc-d2334e8c7b.json');
  
  if (!fs.existsSync(serviceAccountPath)) {
    console.log('❌ Service Account Datei nicht gefunden!\n');
    console.log('Schritt 1: Lade deine Service Account Datei herunter:');
    console.log('  → Gehe zu: https://console.firebase.google.com/');
    console.log('  → Wähle dein Projekt');
    console.log('  → Gehe zu: Projekteinstellungen → Service-Konten');
    console.log('  → Klicke: "Neuen privaten Schlüssel generieren"');
    console.log('  → Speichere die JSON Datei als:');
    console.log(`    ${serviceAccountPath}\n`);
    
    const ready = await question('Wenn du die Datei gespeichert hast, drücke ENTER: ');
    
    if (!fs.existsSync(serviceAccountPath)) {
      console.log('❌ Datei immer noch nicht gefunden!');
      rl.close();
      process.exit(1);
    }
  }

  try {
    console.log('\n🚀 Starte Developer Account Erstellung...\n');
    
    // Führe das existing create-developer.js script aus
    const result = execSync('node ' + path.join(__dirname, 'create-developer.js'), {
      encoding: 'utf-8',
      stdio: 'inherit'
    });

    console.log('\n✅ Developer-Account erfolgreich erstellt!');
  } catch (error) {
    console.error('\n❌ Fehler beim Erstellen des Accounts:');
    console.error(error.message);
    rl.close();
    process.exit(1);
  }

  rl.close();
}

async function setupManual() {
  console.log('\n📋 Manuelles Setup (über Firebase Console)\n');
  console.log('Folge diesen Schritten:\n');
  
  console.log('Schritt 1: Öffne die Firebase Console');
  console.log('  → https://console.firebase.google.com/\n');

  console.log('Schritt 2: Wähle dein Projekt "ecosim"\n');

  console.log('Schritt 3: Gehe zu Authentication → Benutzer');
  console.log('  → Klicke: "Create User" oder "Benutzer hinzufügen"\n');

  console.log('Schritt 4: Fülle folgendes aus:');
  console.log('  📧 E-Mail: developer@ecosim.local');
  console.log('  🔐 Passwort: Developer@12345\n');

  console.log('Schritt 5: Notiere die neue UID (wird nach der Erstellung angezeigt)\n');

  const uid = await question('Gib die UID ein und drücke ENTER: ');

  if (!uid || uid.trim().length === 0) {
    console.log('❌ Keine UID eingegeben!');
    rl.close();
    process.exit(1);
  }

  console.log('\nSchritt 6: Erstelle das Firestore Dokument\n');
  console.log('Gehe in die Firebase Console zu Firestore Database');
  console.log('Klicke auf "Start collection" und erstelle:\n');

  console.log('Collection: users');
  console.log(`Document ID: ${uid.trim()}`);
  console.log('Fields:');
  console.log('  - email (text): developer@ecosim.local');
  console.log('  - displayName (text): EcoSim Developer');
  console.log('  - role (text): developer');
  console.log('  - createdAt (timestamp): jetzt');
  console.log('  - lastLoginAt (timestamp): jetzt\n');

  const done = await question('Wenn du das Dokument erstellt hast, drücke ENTER: ');

  console.log('\n✅ Super! Jetzt kannst du dich anmelden!');
  console.log('   Login: http://localhost:3000/developer/login');
  console.log('   E-Mail: developer@ecosim.local');
  console.log('   Passwort: Developer@12345\n');

  rl.close();
}

main().catch(error => {
  console.error('❌ Fehler:', error);
  rl.close();
  process.exit(1);
});
