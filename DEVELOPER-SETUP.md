# EcoSim Developer Dashboard - Setup für lokale Entwicklung

## 📋 Voraussetzungen

Um als Developer die Schul-Verwaltung im Dashboard zu nutzen, brauchst du:

1. ✅ Developer-Account (siehe SETUP.md)
2. ✅ Firebase Project konfiguriert
3. ⚙️ API-Routes für Schul-Management

## 🚀 Quick Setup (für Development)

### Option 1: Ohne Firebase Admin SDK (einfach, aber mit Limitierungen)

Die API-Routes funktionieren, aber ohne erweiterte Funktionen (z.B. User-Löschung).

**Das Dashboard funktioniert sofort nach dem Setup!**

```bash
npm run dev
```

### Option 2: Mit Firebase Admin SDK (vollständig, empfohlen für Production)

Für die volle Funktionalität (z.B. Schuladmins automatisch löschen), brauchst du die Firebase Admin SDK.

#### Schritt 1: Service Account Key herunterladen

1. Gehe zu [Firebase Console](https://console.firebase.google.com/)
2. Wähle dein Projekt (ecosim)
3. Gehe zu: **Projekteinstellungen** → **Service-Konten**
4. Klicke: **"Neuen privaten Schlüssel generieren"**
5. Speichere die heruntergeladene JSON Datei

#### Schritt 2: Umgebungsvariable setzen

**Option A: .env.local Datei (sicher für Development)**

```bash
# .env.local
FIREBASE_ADMIN_SDK_KEY='{"type":"service_account","project_id":"...","private_key":"...","client_email":"...", ...}'
```

**Option B: Environment Variable im System**

```powershell
# PowerShell
$env:FIREBASE_ADMIN_SDK_KEY = '{"type":"service_account",...}'
npm run dev
```

⚠️ **Wichtig:** 
- Niemals die Datei ins Git committen!
- Die `.env.local` ist bereits in `.gitignore`
- Private Keys gehören nicht ins Repository!

#### Schritt 3: Testen

```bash
npm run dev
```

Öffne: `http://localhost:3000/developer/dashboard`

## 🧪 Testen der Funktionen

### Test 1: Schule anlegen
1. Klicke "+ Neue Schule anlegen"
2. Füll alle Felder aus
3. Klicke "Schule anlegen"
4. ✅ Schule sollte in der Liste erscheinen

### Test 2: Schule bearbeiten
1. Klicke "✏️ Bearbeiten" bei einer Schule
2. Ändere den Namen oder die Anzahl
3. Klicke "Speichern"
4. ✅ Änderungen sollten sofort sichtbar sein

### Test 3: Schule löschen
1. Klicke "🗑️ Löschen" bei einer Schule
2. Gib "LÖSCHEN" ein
3. Klicke "Wirklich löschen"
4. ✅ Schule sollte aus der Liste verschwinden

## 🔧 Troubleshooting

### Problem: "Server nicht konfiguriert - Firebase Admin SDK fehlt"

**Lösung:**
- Edit/Delete funktionieren trotzdem über die Firestore Security Rules
- Für volle Funktionalität: Firebase Admin SDK einrichten (siehe oben)

### Problem: "Ungültiges Token" bei Edit/Delete

**Lösung:**
1. Reite dich ab und wieder an
2. Versuche erneut
3. Überprüfe die Browser-Konsole (F12) auf API-Fehler

### Problem: API-Route antwortet mit 500 Fehler

**Lösung:**
1. Überprüfe: `FIREBASE_ADMIN_SDK_KEY` in `.env.local` korrekt gesetzt?
2. Überprüfe: Ist das JSON valid?
3. Überprüfe: Browser-Konsole für detaillierte Fehlermeldung

## 📚 Weitere Dokumentation

- [SETUP.md](./SETUP.md) - firebase & Vercel Setup
- [DEVELOPER-GUIDE.md](./DEVELOPER-GUIDE.md) - Developer Dashboard Funktionen
- [PROJEKTSTAND.md](./PROJEKTSTAND.md) - Projekt-Übersicht

## 🎯 Nächste Schritte

Nachdem du den Developer-Account erstellt hast:

1. ✅ Login testen
2. ✅ Mindestens eine Test-Schule anlegen
3. ✅ Edit/Delete ausprobieren
4. ✅ Schuladmin-Account verwenden, um Lehrer anzulegen

## 💡 Pro Tipps

- Nutze unterschiedliche Test-Schulen für verschiedene Szenarien
- Testet gerne auch mit vielen Schulen (Performance-Test)
- Meldet Bugs oder Feature-Wünsche!

---

**Fragen?** Siehe SETUP.md für Firebase-Konfiguration oder kontaktiere den Support.
