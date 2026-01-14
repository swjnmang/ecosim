# Setup-Anleitung: Neues Rollen-System

## Übersicht der Änderungen

Das System wurde umgestellt auf ein hierarchisches Rollen-System:
- **Developer** → Legt Schulen an
- **School-Admin** → Verwaltet seine Schule und legt Lehrkräfte an  
- **Teacher** → Unterrichtet mit EcoSim

## 1. Developer-Account erstellen

### Manuell in Firebase Console:

1. Öffne Firebase Console → Authentication
2. Erstelle einen neuen User mit deiner E-Mail und Passwort
3. Notiere die User-UID

4. Gehe zu Firestore Database
5. Erstelle eine neue Collection `users`
6. Erstelle ein Dokument mit der User-UID als Document ID:
   ```json
   {
     "email": "deine-email@beispiel.de",
     "displayName": "Dein Name",
     "role": "developer",
     "createdAt": [Firestore Timestamp - now],
     "lastLoginAt": [Firestore Timestamp - now]
   }
   ```

### Alternative: Firebase Admin SDK Script

Erstelle ein Script `scripts/create-developer.js`:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./path-to-your-serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function createDeveloper() {
  const email = 'deine-email@beispiel.de';
  const password = 'sicheres-passwort'; // Mindestens 6 Zeichen
  
  try {
    // Create Firebase Auth user
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: 'Entwickler'
    });
    
    // Create Firestore user document
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email: email,
      displayName: 'Entwickler',
      role: 'developer',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('Developer account created successfully!');
    console.log('UID:', userRecord.uid);
    console.log('Email:', email);
  } catch (error) {
    console.error('Error creating developer:', error);
  }
}

createDeveloper();
```

## 2. Firestore Security Rules deployen

Die Firestore Rules wurden bereits aktualisiert in `firestore.rules`.

Deploy sie mit:
```bash
firebase deploy --only firestore:rules
```

## 3. Workflow

### Als Developer:
1. Gehe zu `/developer/login`
2. Melde dich mit deinem Developer-Account an
3. Erstelle Schulen über das Developer-Dashboard
4. Für jede Schule wird automatisch ein Admin-Account erstellt

### Als School-Admin:
1. Gehe zu `/school-admin/login`  
2. Melde dich mit den vom Developer erhaltenen Zugangsdaten an
3. Verwalte deine Schule:
   - Schulinformationen bearbeiten
   - Lehrkräfte anlegen
   - Lehrkräfte deaktivieren
   - Statistiken einsehen (geplant)

### Als Teacher:
1. Gehe zu `/teacher/login`
2. Melde dich mit den vom School-Admin erhaltenen Zugangsdaten an
3. Nutze EcoSim wie gewohnt

## 4. Bestehende Teacher-Accounts

Bestehende Lehrkräfte in der `teachers` Collection funktionieren weiterhin (Legacy-Support).

Um sie ins neue System zu migrieren:
1. Erstelle die Schule über Developer-Dashboard
2. Füge die Lehrkräfte manuell als neue Accounts über School-Admin an
3. Optional: Lösche alte Accounts aus `teachers` Collection

## 5. Routes

- `/developer/login` - Developer-Login (nicht öffentlich verlinkt)
- `/developer/dashboard` - Schulen verwalten
- `/school-admin/login` - School-Admin Login  
- `/school-admin/dashboard` - Schul-Verwaltung
- `/teacher/login` - Lehrkräfte-Login (keine Registrierung mehr)
- `/teacher/dashboard` - Lehrkräfte-Dashboard (wie bisher)

## 6. Collections in Firestore

### Neue Collections:
- `users` - Alle User (Developer, School-Admins, Teachers)
- `schools` - Schulinformationen

### Bestehende Collections (unverändert):
- `lobbies` - Spiel-Lobbies
- `sessions` - Spieler-Sessions  
- `tasks` - Aufgaben
- Etc.

### Legacy:
- `teachers` - Alte Lehrkräfte (für Abwärtskompatibilität)

## Hinweise

- Der `/teacher/register` Endpoint wurde entfernt
- Neue Lehrkräfte können nur noch von School-Admins angelegt werden
- Schulen können nur noch von Developers angelegt werden
- Die Firestore Security Rules wurden entsprechend angepasst
