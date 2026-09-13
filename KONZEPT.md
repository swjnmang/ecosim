# EcoSim – Neukonzept (Stand 13.09.2026)

> Ersetzt die Planung in PROJEKTSTAND.md. Ziel: sauberes Rollen-/Rechte-Modell,
> DSGVO-konformer Datenumgang, realitätsnaher Posteingang-Workflow.
> Alter Code wird archiviert, nicht gelöscht.

---

## 1. Vision (unverändert, präzisiert)

EcoSim ist eine Multiplayer-Simulation eines **Handelsunternehmens** für den
Übungsunternehmen-Unterricht (Wirtschaftsschule Bayern). Schüler:innen
übernehmen die Rolle von Mitarbeitenden und bearbeiten realitätsnahe
Geschäftsvorfälle: Wareneinkauf, Verkauf, Kalkulation, Lagerhaltung,
Buchungssätze, Kundenkommunikation.

Zentrale Arbeitsmetapher: **Posteingang.** Schüler:innen erhalten dort ihre
Arbeitsaufträge (Kundenanfragen, Vorgesetzten-Aufträge, Lieferanten-Antworten,
Systemhinweise) und klicken sich durch die Bearbeitung – analog zu einem
echten Büroarbeitsplatz.

---

## 2. Rollen- und Rechtemodell

Drei Ebenen, strikt getrennt:

```
Organisation (Schule)
└─ Schul-Admin (1..n)              – echter Account, Email+Passwort
   └─ Lehrkraft (1..n)             – echter Account, von Schul-Admin eingeladen
      └─ Spiel / Durchlauf         – von Lehrkraft erstellt, hat PIN + Zeitraum
         └─ Übungsunternehmen (1..n je Spiel)
            └─ Teilnehmer:in       – KEIN echter Account, pseudonym, per PIN beigetreten
```

**Schul-Admin**
- Verwaltet Lehrkräfte-Accounts der eigenen Schule (einladen, deaktivieren)
- Sieht keine Schüler-/Spieldaten, nur Verwaltung der Organisation
- Ersetzt die heutige "Developer"-Rolle für den Schulbetrieb; ein echter
  Developer/Betreiber-Zugang (für uns) bleibt separat und minimal

**Lehrkraft**
- Erstellt Spiele (mit Lernbereich-Konfiguration, Zeitraum, Schwierigkeitsgrad)
- Lädt Teilnehmer:innen per PIN/Link ein
- Steuert Störungen und Marktereignisse während des laufenden Spiels
- Sieht **nur Pseudonyme** und Leistungsdaten der Teilnehmer:innen, keine Klarnamen
- Bekommt am Ende Zugriff auf aggregierte Auswertungen (nicht auf Einzel-Klarnamen)

**Teilnehmer:in (Schüler:in)**
- Tritt einem Spiel per PIN bei, wählt ein Pseudonym/Anzeigename (frei wählbar,
  kein Klarname-Zwang, keine Validierung gegen echte Namen)
- Bekommt ein zufälliges, nicht-personenbezogenes Session-Token (kein Login,
  kein Passwort, keine Email nötig)
- Wird bei Beitritt einem Unternehmen und einer **Abteilungsrolle** zugeteilt
  (Einkauf / Verkauf / Buchhaltung) – bestimmt, welche InboxItem-Typen und
  Aktionen sichtbar/erlaubt sind
- Arbeitet **gleichzeitig mit anderen Teilnehmer:innen derselben Firma** auf
  einem geteilten Live-Zustand (Lager, Kontostand, Posteingang) – siehe
  Abschnitt 7

---

## 3. DSGVO-Datenfluss (Kernentscheidung)

**Grundsatz: Klarnamen und Klassenbezeichnungen verlassen niemals den Browser
der Schülerin/des Schülers.**

- In der Datenbank existieren zu Teilnehmer:innen ausschließlich:
  Pseudonym, zufällige ID, Spielzugehörigkeit, Leistungsdaten (XP, Fehler,
  bearbeitete Vorgänge)
- Kein Feld für echten Namen, Klasse, Geburtsdatum o.ä. existiert im Schema –
  nicht nur "leer gelassen", sondern **strukturell nicht vorhanden**
- **Tagesabschluss-PDF:** Am Ende einer Sitzung generiert die Teilnehmer:in
  ihren Tätigkeitsbericht. Der Name wird **erst in diesem Moment, clientseitig,
  im Browser abgefragt** und direkt in ein PDF gerendert (z.B. mit `pdf-lib`
  oder `@react-pdf/renderer` im Browser, ohne Server-Roundtrip). Das PDF wird
  lokal heruntergeladen; der eingegebene Name wird **nie an den Server
  gesendet oder gespeichert**
- Zuordnung Pseudonym ↔ Klarname existiert also nur auf Papier/lokalem PDF bei
  der Lehrkraft/Schüler:in selbst – nicht in der App
- Aufbewahrung: Spieldaten bekommen ein Ablaufdatum (z.B. automatische Löschung
  X Tage nach Spielende) – Details als offene Frage unten
- Für den Datenbank-Anbieter: EU-Hosting/-Region ist Pflicht, AVV muss vorliegen

---

## 4. Datenmodell (technologieunabhängig, Kernentitäten)

| Entität | Zweck |
|---|---|
| `Organization` | Schule |
| `AdminUser` | Schul-Admin, echter Account |
| `TeacherUser` | Lehrkraft, echter Account |
| `GameSession` | Ein Spieldurchlauf: PIN, Zeitraum, Lernbereich-Konfig, Status |
| `Participant` | Pseudonymer Teilnehmer in genau einer GameSession, Session-Token statt Login, mit `department` (Einkauf/Verkauf/Buchhaltung) |
| `Company` | Übungsunternehmen innerhalb einer GameSession, hat 1..n Participants mit geteiltem Live-Zustand (Lager, Konto) |
| `Product` | Katalogartikel, Branche: Fahrrad- & E-Bike-Zubehör |
| `Supplier` / `Customer` | Handelspartner (NPC oder andere Companies) |
| `InboxItem` | Vorgang im Posteingang: Typ (Kundenanfrage, Chef-Auftrag, Lieferanten-Antwort, Systemhinweis), Status, verknüpfte Belege |
| `Quote` / `PurchaseOrder` / `SalesOrder` / `DeliveryNote` / `Invoice` | Beleg-Kette je Vorgang, mit klaren Zustandsübergängen |
| `Inventory` | Lagerbestand je Product je Company: Bestand, Mindestbestand, Meldebestand |
| `BookingEntry` | Buchungssatz |
| `PerformanceLog` | XP, Fehler, bearbeitete Vorgänge – Basis für den Tagesbericht |

Wichtig gegenüber dem alten Modell: **Beleg-Kette und Posteingang-Vorgang sind
getrennt modelliert**, damit ein Vorgang (z.B. Kundenanfrage) sauber durch
mehrere Belegtypen wandert, ohne dass Status-Logik in einem Mega-Objekt landet.

---

## 5. Workflow-Prinzip (eigenständig, funktional inspiriert)

1. Posteingang zeigt offene Vorgänge, priorisiert/sortiert nach Alter oder Dringlichkeit
2. Teilnehmer:in öffnet einen Vorgang → Detailansicht mit den für diesen
   Vorgangstyp gültigen Aktionen (z.B. bei Kundenanfrage: Angebot erstellen,
   ablehnen, Rückfrage stellen)
3. Jeder Vorgang durchläuft eine sichtbare Status-Pipeline (eigene Bezeichnungen,
   nicht 1:1 aus der Inspirationsquelle übernommen)
4. Abgeschlossene/versendete Dokumente erscheinen im Postausgang
5. Lagerbestand wird mit Ampel-Logik (ausreichend / Meldebestand erreicht /
   Mindestbestand unterschritten / leer) visualisiert – eigene Schwellenwerte,
   eigene Farbwelt
6. Am Ende der Sitzung: Tätigkeitsbericht als PDF (siehe DSGVO-Abschnitt)

---

## 6. Tech-Stack-Vorschlag

| Bereich | Vorschlag | Begründung |
|---|---|---|
| Frontend | Next.js (App Router) beibehalten | Bereits eingerichtet, gutes Ökosystem, SSR wo nötig |
| Datenbank | **Postgres via Supabase** (statt Firestore) | Geschäftsdaten sind stark verknüpft (Bestellung↔Rechnung↔Buchung↔Lager); referenzielle Integrität und Transaktionen sind mit SQL natürlicher. Supabase liefert zusätzlich **Realtime Subscriptions** und **Row Level Security** in einem Paket – beides wird durch die geteilte Live-Firmenansicht (Abschnitt 7) zur Pflicht, nicht nur zur Kür |
| ORM | Prisma | Typsicheres Schema, gute Next.js-Integration, erleichtert die saubere Trennung Participant-Daten (keine PII) |
| Bestands-/Kontoänderungen | Postgres-Transaktionen bzw. atomare `UPDATE ... WHERE stock >= x`-Statements | Verhindert Überverkauf bei gleichzeitigem Zugriff mehrerer Teilnehmer:innen derselben Firma |
| Live-Sync | Supabase Realtime (Postgres Changes) | Lager/Konto/Posteingang aktualisieren sich bei allen Teilnehmer:innen einer Firma ohne Reload |
| Auth Admin/Lehrkraft | Supabase Auth mit Email+Passwort | Echte Accounts, Passwort-Reset etc. nötig |
| Auth Teilnehmer:in | Kein klassisches Auth – Session-Token nach PIN-Beitritt, in Cookie/localStorage, serverseitig nur mit Pseudonym+Abteilungsrolle verknüpft | Vermeidet jede Form von Account/PII für Schüler:innen |
| PDF-Erstellung | Clientseitig, z.B. `@react-pdf/renderer` im Browser | Name verlässt den Browser nie |
| Hosting | Vercel (weiter) | Bereits deployt, EU-Region wählbar |
| DB-Hosting | Supabase EU-Region (Frankfurt) zwingend | DSGVO |

---

## 7. Entscheidungen (13.09.2026)

- **Abteilungsrollen:** Ja, von Anfang an. Teilnehmer:innen eines Unternehmens
  bekommen eine Abteilungsrolle (Einkauf / Verkauf / Buchhaltung) mit jeweils
  eigenen Rechten und eigener Posteingang-Sicht. Wirkt sich direkt auf das
  `Participant`-Modell aus (Feld `department`) und auf die Berechtigungslogik
  pro InboxItem-Typ.
- **Handel zwischen Unternehmen:** Erstmal NICHT. Erste Ausbaustufe arbeitet
  ausschließlich mit NPC-Kunden und NPC-Lieferanten. Unternehmen-zu-Unternehmen-
  Handel ist explizit als spätere Ausbaustufe vorgesehen, nicht Teil des
  ersten Datenmodells (aber beim Schema-Entwurf so vorbereiten, dass es sich
  ergänzen lässt, ohne alles umzubauen).

- **Branche:** Großhandel für **Fahrrad- & E-Bike-Zubehör** (Schlösser,
  Beleuchtung, Akkus, Gepäckträger, Reifen u.ä.). Eigene Produktwelt,
  eigene Lieferanten/Kunden – keine Übernahme aus Inspirationsquelle oder
  altem Sportartikel-Katalog. Qualitätsmerkmale wie Ladezyklen/Reichweite bei
  Akkus, Materialgüte bei Schlössern, Saisonalität (Frühjahr/Sommer-Nachfrage)
  bieten sich für Marktereignisse und Kalkulationsübungen an.

- **Team-Größe & Nebenläufigkeit:** Mehrere Teilnehmer:innen arbeiten
  **gleichzeitig, jede:r einzeln eingeloggt** in **demselben Unternehmen**
  mit **geteiltem Live-Zustand**. Verkauft ein:e Teilnehmer:in Ware, muss der
  Lagerbestand sofort auch bei den anderen Teilnehmer:innen desselben
  Unternehmens sinken – kein Neuladen nötig.
  **Technische Konsequenz:**
  - Bestandsänderungen (Lager, Kontostand) müssen **transaktionssicher** sein
    (DB-Transaktionen mit Zeilensperren o.ä.), damit nicht zwei Teilnehmer:innen
    gleichzeitig das letzte Stück verkaufen können (Überverkauf-Schutz)
  - Die Oberfläche braucht **Echtzeit-Synchronisierung** (z.B. Supabase
    Realtime Subscriptions oder WebSockets) statt Polling/Reload
  - `Participant` bleibt weiterhin individuell (eigenes Pseudonym, eigene
    Session, eigener PerformanceLog), ist aber `Company`-Kollege:in mit
    geteiltem Zugriff auf Inventory/Kontostand/InboxItems der Firma
- **Startkapital & Zeittakt:** Von der Lehrkraft pro Spiel konfigurierbar.
  Kein Ingame-Zeitraffer – das Spiel läuft in Echtzeit über die konfigurierte
  Spieldauer.
- **Aufbewahrungsfrist:** 90 Tage nach Spielende, danach automatische Löschung
  aller Spieldaten (Scheduled Job / Cron).

---

## 9. Nächste Schritte

Konzept steht, alle offenen Fragen sind entschieden (Abschnitt 7). Ab hier:

1. Datenbankschema (Prisma) auf Basis Abschnitt 4 final entwerfen, inkl.
   `department`-Feld und Realtime-fähiger Struktur für Inventory/Konto
2. Alten Code als `archive/v1`-Branch sichern, main leeren
3. Supabase-Projekt (EU-Region) + Vercel-Verbindung aufsetzen
4. Neues Grundgerüst aufsetzen (Auth-Flows für Admin/Lehrkraft, PIN-Beitritt
   für Teilnehmer:innen, leeres Dashboard je Rolle)
5. Posteingang-Workflow als erstes vertikales Feature bauen (ein Vorgangstyp
   Ende-zu-Ende, z.B. Kundenanfrage → Angebot → Bestellung), inkl. Realtime-Test
   mit zwei gleichzeitigen Teilnehmer:innen derselben Firma
