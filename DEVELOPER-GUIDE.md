## Developer Dashboard - Schul-Verwaltung

Als Entwickler kannst du registrierte Schulen verwalten. Das Dashboard bietet folgende Funktionen:

### ✨ Funktionen

#### 1. **Schulen anzeigen**
- Liste aller registrierten Schulen
- Anzahl der Schüler/innen
- Kontakt-E-Mail
- Admin ID
- Erstellungsdatum

#### 2. **Neue Schule anlegen**
- Schulname
- Anzahl der Schüler/innen
- Kontakt-E-Mail der Schule
- Automatische Erstellung eines Schuladmin-Accounts
  - Admin E-Mail
  - Admin Passwort
  - Admin Name

#### 3. **Schule bearbeiten** ✏️
- Schulname ändern
- Schüler/innen-Anzahl aktualisieren
- Kontakt-E-Mail aktualisieren
- Änderungen sofort speichern

#### 4. **Schule löschen** 🗑️
- Sichere Löschung mit Bestätigung
- Löscht auch:
  - Schuladmin-Account
  - Alle Lehrer-Accounts
  - Alle zugehörigen Lobbyund Spieldaten

### 🔐 Sicherheit

- Nur der Entwickler kann Schulen verwalten
- Firebase Authentication wird überprüft
- Bestätigung erforderlich beim Löschen
- JWT-Token-basierte API-Authentifizierung

### 📋 Technische Details

**API Endpoints:**

```
GET    /api/schools/[schoolId]          - Schuldaten abrufen
PUT    /api/schools/[schoolId]          - Schule bearbeiten
DELETE /api/schools/[schoolId]          - Schule löschen
```

**Erforderliche Header:**
```
Authorization: Bearer <idToken>
```

**Entwicklung für lokale Server (ohne Firebase Admin SDK):**

Falls die API-Routen nicht funktionieren, stelleich alternativ auch Firestore Direct Calls zur Verfügung. Bitte kontaktiere den Support oder siehe die Alternative im Dashboard-Code.

### 🚀 Zugang

URL: `http://localhost:3000/developer/dashboard`

**Anmeldedaten:**
```
E-Mail: developer@ecosim.local
Passwort: Developer@12345
```

### 📝 Features für die Zukunft

- [ ] CSV-Export aller Schulen
- [ ] Massenimport von Schulen
- [ ] Lehrer-Verwaltung pro Schule
- [ ] Aktivitäts-Log
- [ ] Backup & Restore
