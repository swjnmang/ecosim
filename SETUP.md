# Firebase & Vercel Setup

## 1. Firebase Projekt erstellen

### Schritt 1: Firebase Console
1. Gehe zu [Firebase Console](https://console.firebase.google.com/)
2. Klicke auf "Projekt hinzufügen"
3. Name: **ecosim** (oder ein anderer Name)
4. Google Analytics kann optional aktiviert werden
5. Projekt erstellen

### Schritt 2: Web App hinzufügen
1. In der Projektübersicht: "Web" Icon klicken (</> Symbol)
2. App-Spitzname: **ecosim-web**
3. Firebase Hosting **NICHT** einrichten (wir nutzen Vercel)
4. App registrieren

### Schritt 3: Konfigurationswerte kopieren
Nach der Registrierung werden dir die Config-Werte angezeigt:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "ecosim-xxxxx.firebaseapp.com",
  projectId: "ecosim-xxxxx",
  storageBucket: "ecosim-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxx"
};
```

**Trage diese Werte in `.env.local` ein!**

### Schritt 4: Authentication aktivieren
1. Im Firebase-Menü: **Authentication** → **Get Started**
2. Sign-in method → **Anonymous** aktivieren
3. Speichern

### Schritt 5: Firestore Database erstellen
1. Im Firebase-Menü: **Firestore Database** → **Create database**
2. Location: **europe-west** (Europa) wählen
3. **Im Testmodus starten** (später ändern wir die Rules)
4. Database erstellen

### Schritt 6: Firestore Security Rules anwenden
1. In der Firebase Console → **Firestore Database** → **Rules**
2. Ersetze den Inhalt mit dem Inhalt aus `firestore.rules` (aus diesem Projekt)
3. Veröffentlichen

### Schritt 7: Storage Rules (optional, später)
1. Im Firebase-Menü: **Storage** → **Get Started**
2. Im Produktionsmodus starten
3. Rules aus `firebase.rules` übernehmen

---

## 2. Lokale Entwicklung testen

### Schritt 1: Dependencies installieren
```bash
npm install
```

### Schritt 2: .env.local prüfen
Stelle sicher, dass `.env.local` deine Firebase-Credentials enthält.

### Schritt 3: Development Server starten
```bash
npm run dev
```

App läuft unter: http://localhost:3000

---

## 3. Vercel Deployment

### Schritt 1: Vercel Account
1. Gehe zu [vercel.com](https://vercel.com)
2. Mit GitHub anmelden
3. "New Project" klicken

### Schritt 2: Repository importieren
1. Wähle dein **ecosim** Repository
2. Framework Preset: **Next.js** (automatisch erkannt)
3. Root Directory: `./` (Standard)

### Schritt 3: Environment Variables hinzufügen
Füge alle Variablen aus `.env.local` hinzu:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ecosim-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ecosim-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ecosim-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:xxxxx
```

### Schritt 4: Deploy!
1. Klicke auf "Deploy"
2. Warte 2-3 Minuten
3. Deine App ist live! 🎉

### Schritt 5: Custom Domain (optional)
1. In Vercel: Settings → Domains
2. Füge deine Domain hinzu (z.B. `ecosim.schule.de`)
3. Folge den DNS-Anweisungen

---

## 4. Firebase Authorized Domains aktualisieren

Nach dem Vercel-Deployment:

1. Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Füge deine Vercel-URL hinzu: `ecosim-xxxxx.vercel.app`
3. Falls Custom Domain: auch diese hinzufügen

---

## 5. Automatische Deployments

**Jeder Push zu `main` Branch löst automatisch ein Vercel-Deployment aus!**

- Pull Requests erstellen Preview-Deployments
- Production ist immer `main` Branch

---

## Troubleshooting

### "Firebase: Error (auth/unauthorized-domain)"
→ Vercel-URL zu Firebase Authorized Domains hinzufügen

### "FirebaseError: Missing or insufficient permissions"
→ Firestore Rules überprüfen und neu veröffentlichen

### Build-Fehler bei Vercel
→ Prüfe, ob alle Dependencies in `package.json` sind
→ Prüfe TypeScript-Fehler mit `npm run build` lokal

### Environment Variables funktionieren nicht
→ Vercel: Settings → Environment Variables neu setzen
→ Projekt neu deployen (Redeploy-Button)

---

## Nützliche Links

- [Firebase Console](https://console.firebase.google.com/)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Firebase Docs](https://firebase.google.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)

---

## Checkliste

- [ ] Firebase Projekt erstellt
- [ ] Web App in Firebase registriert
- [ ] Anonymous Auth aktiviert
- [ ] Firestore Database erstellt
- [ ] Firestore Rules veröffentlicht
- [ ] `.env.local` mit echten Werten ausgefüllt
- [ ] `npm install` ausgeführt
- [ ] `npm run dev` funktioniert lokal
- [ ] Vercel Account erstellt
- [ ] Repository in Vercel importiert
- [ ] Environment Variables in Vercel gesetzt
- [ ] Erster Deploy erfolgreich
- [ ] Vercel-URL zu Firebase Authorized Domains hinzugefügt
- [ ] App funktioniert in Production!

---

Bei Fragen oder Problemen: Melde dich! 😊
