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
| `Company` | Übungsunternehmen innerhalb einer GameSession, hat 1..n Participants mit geteiltem Live-Zustand (Lager, Konto); Name/Icon entweder aus `CompanyTemplate` übernommen oder von der Lehrkraft frei vergeben |
| `CompanyTemplate` | Vorgefertigte Firmen-Vorschläge (Name + Logo/Icon, Branchen-passend) zur Auswahl beim Spiel-Setup |
| `Product` | Katalogartikel, Branche: Fahrrad- & E-Bike-Zubehör |
| `Supplier` / `Customer` | Handelspartner (NPC oder andere Companies) |
| `InboxItem` | Vorgang im Posteingang: Typ (Kundenanfrage, Chef-Auftrag, Lieferanten-Antwort, Systemhinweis), Status, verknüpfte Belege |
| `Order` | Wird beim Annehmen einer Kundenanfrage (Verkauf) oder Auslösen einer Bestellung (Einkauf) erzeugt. Bekommt eine **eindeutige, für die Firma fortlaufende Auftragsnummer**, Typ (Einkauf/Verkauf), Status-Pipeline (erledigte/offene Schritte), Zeitstempel je Schritt, verantwortliche:r Participant je Schritt |
| `Quote` / `PurchaseOrder` / `SalesOrder` / `DeliveryNote` / `Invoice` | Beleg-Kette, jeweils einer `Order` zugeordnet, mit klaren Zustandsübergängen |
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

*Firebase wäre technisch ebenfalls möglich (EU-Hosting, ausgereiftes Realtime/Auth),
wurde aber am 13.09.2026 bewusst zugunsten von Supabase verworfen – das
relationale Modell passt besser zu den stark verknüpften Geschäftsdaten
(Bestellung/Rechnung/Buchung/Lager) und späteren Auswertungen (Controlling,
Kalkulationsberichte).*

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

## 9. UI-Konzept: Desktop-Metapher

Nach Login landet die Teilnehmer:in auf einem **Tablet-Grid-Desktop**
(kein echtes Windows-Fenstersystem – App-Icons, Klick öffnet die App im
Vollbild, Zurück-Button führt zum Desktop zurück). Bewusst einfacher als ein
Mehrfenster-System, funktioniert zuverlässig auf Schul-Tablets/Laptops.

**Sichtbarkeit:** Alle Icons sind für alle Teilnehmer:innen einer Firma
sichtbar (voller Überblick über die Firma), unabhängig von der eigenen
Abteilungsrolle. Klick auf ein Icon außerhalb der eigenen Abteilung öffnet
eine **Nur-Lese-Ansicht** (z.B. Verkauf sieht den Kontostand im Onlinebanking,
kann aber keine Buchung vornehmen) statt einer reinen Sperre – das dient dem
Lerneffekt (Gesamtüberblick über den Betrieb), ohne fremde Bearbeitungsrechte
zu geben. Genaue Nur-Lese- vs. komplett-gesperrt-Regelung wird pro App beim
Bau festgelegt.

**App-Übersicht (vorläufig, nach Abteilung gruppiert):**

*Für alle (Basis-Apps):*
- Posteingang – zentrale Arbeitsaufträge/Anfragen
- Mein Unternehmen – Kontostand, Kennzahlen, Reputation
- **Auftragsstatus** – Suche per Auftragsnummer, Liste aller laufenden
  Aufträge der Firma, Detailansicht je Auftrag mit erledigten und offenen
  Schritten (Pipeline). Auftragsnummer wird automatisch vergeben, sobald ein
  Einkaufs- oder Verkaufsvorgang angenommen/ausgelöst wird
- Feierabend/Tagesbericht – löst clientseitige PDF-Erstellung aus

*Einkauf:* Bestellungen, Warenannahme, Lieferantenkartei
*Verkauf:* Kundensuche, Warenversand, Auftragsbearbeitung
*Einkauf & Verkauf gemeinsam:* Lager (Bestand, Mindest-/Meldebestand)
*Buchhaltung:* Onlinebanking, Buchungssätze, Kalkulation

Grobstruktur (Basis-Apps oben, darunter nach Abteilung gruppierte Icons) ist
mit Wireframe bestätigt.

**Auftragsstatus-Detailansicht:** Erledigte Pipeline-Schritte sind anklickbar
und öffnen das jeweils zugehörige Dokument (z.B. das versendete Angebot, die
Auftragsbestätigung) direkt zur Ansicht.

**Firmen-Branding:** Beim Erstellen eines Spiels stellt das System (von mir
vorab erstellte) **Firmen-Vorschläge** bereit (Name + Logo/Icon, passend zur
Fahrrad-/E-Bike-Branche) – die Lehrkraft wählt daraus für ihre Spiele. Zusätzlich
kann die Lehrkraft auch **eigene Unternehmen frei anlegen** (eigener Name,
ggf. eigenes Icon) statt nur aus den Vorschlägen zu wählen. Teilnehmer:innen
wählen selbst keinen Firmennamen.

---

## 10. Nächste Schritte

Konzept steht, alle offenen Fragen sind entschieden (Abschnitt 7).

**Erledigt:**
1. ✅ Alter Code als `archive/v1`-Branch gesichert, main geleert
2. ✅ Datenbankschema (`prisma/schema.prisma`) nach Abschnitt 4/9 entworfen –
   inkl. `department`, `Order`/`OrderStep`-Pipeline mit klickbaren Dokumenten,
   `CompanyTemplate`
3. ✅ Next.js-Grundgerüst (App Router, TypeScript, Tailwind) aufgesetzt
4. ✅ Desktop-UI-Komponente nach Wireframe gebaut (`src/components/desktop`),
   Auftragsstatus-App mit Suche + klickbarer Pipeline (`src/components/auftragsstatus`)
5. ✅ Firmenvorschläge (6) und Produktkatalog (Fahrrad-/E-Bike-Zubehör, eigenständig)
   als Seed-Daten (`prisma/seed-data`)
6. ✅ Routen-Grundgerüst: `/`, `/play` (PIN-Beitritt), `/teacher`, `/admin`,
   `/app` (Desktop), `/app/[app]` (Einzel-Apps)

7. ✅ Supabase-Projekt (EU-Region Frankfurt, Org "Matenkik") angelegt, Migration
   + Seed laufen gegen die echte DB (6 Firmenvorlagen, 15 Produkte, 4 Lieferanten,
   5 Kunden)
8. ✅ PIN-Beitritt serverseitig umgesetzt (`/api/join`): legt Participant mit
   Pseudonym, Abteilung und Session-Token an, Desktop liest echte Firma/Konto
   aus der DB (`prisma/seed-dev.ts` liefert ein Demo-Spiel, PIN `123456`, für
   Tests ohne fertige Lehrkraft-Auth)

**Noch offen:**
9. Auth-Flows für Admin/Lehrkraft (Supabase Auth) real anbinden - erst danach
   können Lehrkräfte echte Spiele/Firmen selbst anlegen (aktuell nur über
   `seed-dev.ts`)
10. Mehrere Firmen pro Spiel + Firmenauswahl beim Beitritt (aktuell landet
    jede:r Teilnehmer:in in der ersten Firma des Spiels)
11. Posteingang-Workflow als erstes vertikales Feature Ende-zu-Ende (ein
    Vorgangstyp, z.B. Kundenanfrage → Angebot → Bestellung) inkl. Realtime-Test
    mit zwei gleichzeitigen Teilnehmer:innen derselben Firma
12. Übrige Apps (Bestellungen, Warenannahme, Lieferanten, Kundensuche,
    Warenversand, Auftragsbearbeitung, Lager, Onlinebanking, Buchungssätze,
    Kalkulation) von Platzhalter zu echter Funktion
