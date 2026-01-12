# EcoSim - Übungsunternehmen Simulation
## Projektübersicht & Implementierungsstand

**Stand:** 12.01.2026  
**Zielgruppe:** Schülerinnen und Schüler der Wirtschaftsschule Bayern (Fach: Übungsunternehmen)

---

## 🎯 Vision

Eine realitätsnahe **Unternehmenssimulation** für Kaufleute für Büromanagement mit:
- Multiplayer-Wettbewerb am gemeinsamen Markt
- Handel zwischen Unternehmen
- Praxisnahe Geschäftsprozesse (Einkauf, Verkauf, Kalkulation, Buchung)
- Separatem Prüfungsmodus für gezielte Übungen
- XP-System mit Leveln und Badges
- Lehrkraft-Steuerung für Lernbereiche und Störungen

---

## 📚 Abgebildete Lernbereiche (gemäß Lehrplan)

### ✅ Priorisiert (in Entwicklung)
- **Lernbereich 2:** Einkauf
- **Lernbereich 3:** Verkauf
- **Lernbereich 5:** Marketing
- **Lernbereich 6:** Controlling
- **Lernbereich 7:** Finanzen

### 📌 Besondere Übungsschwerpunkte
- Einkaufs- und Verkaufsprozesse
- Bezugs- und Handelskalkulation
- Buchungssätze schreiben
- Kaufvertragsstörungen (Lieferverzug, Falschlieferung, Mängel, Mahnungen)

---

## 🛠️ Implementierungsstand

### ✅ Abgeschlossen

#### 1. **Datenmodelle (firestore.ts)**
- `Company` - Unternehmen mit Statistiken, Mitarbeitern, Reputation
- `PlayerSession` - Spieler mit XP, Level, Skills, Rollen
- `Product` - Sportartikel-Katalog (17 Produkte)
- `Supplier` - Lieferanten mit Konditionen (4 Standard-Lieferanten)
- `Customer` - Kunden (Unternehmen + NPCs)
- `PurchaseOrder` - Einkaufsaufträge
- `SalesOrder` - Verkaufsaufträge
- `Invoice` - Ein- und Ausgangsrechnungen
- `BookingEntry` - Buchungssätze
- `ContractDisturbance` - Kaufvertragsstörungen
- `Calculation` - Kalkulationen (Bezug, Handel, Deckungsbeitrag, Break-Even)
- `MarketEvent` - Marktereignisse
- `ExamMode` - Prüfungsmodus
- `Inventory` - Lagerverwaltung
- Erweiterte `Lobby` mit Lernbereich-Konfiguration

#### 2. **Produktkatalog (templates.ts)**

**Schuhe** (3 Produkte)
- ProRun Laufschuh (45 € EK → 89,99 € UVP)
- TrailMaster Wanderschuh (55 € → 119,99 €)
- CourtKing Tennisschuh (38 € → 74,99 €)

**Sneaker** (2 Produkte)
- Urban Classic Low (32 € → 64,99 €)
- RetroWave High-Top (42 € → 89,99 €)

**Fußbälle** (3 Produkte)
- MatchPro Fußball Gr. 5 (18 € → 39,99 €)
- Youth Training Ball Gr. 4 (14 € → 29,99 €)
- Indoor Futsal Pro (22 € → 49,99 €)

**Sportkleidung** (4 Produkte)
- DryTech Running Shirt (15 € → 32,99 €)
- FlexFit Sport-Leggings (18 € → 39,99 €)
- Team Jersey Set (28 € → 59,99 €)
- Winter Training Jacket (42 € → 89,99 €)

**Smartwatches** (3 Produkte)
- FitTrack Pro 5 (85 € → 179,99 €)
- RunnerWatch Basic (45 € → 89,99 €)
- MultiSport Elite (145 € → 299,99 €)

**Lieferanten** (4 Standard-Lieferanten)
1. SportGroßhandel Müller GmbH (München) - Allgemein Sportartikel
2. TechSport Import & Export AG (Hamburg) - Smartwatches & Sneaker
3. Outdoor & More Handelsgesellschaft (Freiburg) - Outdoor-Artikel
4. UrbanStyle Sportswear (Berlin) - Sneaker & Sportkleidung

#### 3. **XP-System (xpSystem.ts)**

**XP-Belohnungen:**
- Einkauf: 5-25 XP (Anfrage → Bestellung → Prüfung → Kalkulation)
- Verkauf: 5-25 XP
- Buchung: 15-25 XP
- Störungen: 20-30 XP
- Controlling: 20-35 XP
- Prüfungen: 50-100 XP

**Level-System:**
- Dynamische XP-Anforderung: Level 1 = 100 XP, Level 2 = 150 XP, Level 3 = 225 XP...
- Formel: `XP = 100 × 1,5^(level-1)`

**Badges:**
- Einkauf/Verkauf Rookie & Profi
- Buchungsmeister
- Kalkulationsgenie
- Fehler-Detektiv
- Mahnungsprofi
- Level-Milestones (10, 25)
- Perfektionist

#### 4. **Lehrkraft-Steuerung (teacherControls.ts)**

**Lernbereich-Konfiguration:**
- Granulare Steuerung für 6 Hauptbereiche
- Untermodule einzeln aktivierbar (z.B. Einkauf → Lieferantensuche, Angebotsvergleich, etc.)
- Default-Konfiguration vordefiniert

**Störungen auslösen:**
- Lieferverzug (3 Varianten)
- Schlechtleistung - Menge
- Schlechtleistung - Qualität
- Schlechtleistung - Falsche Ware
- Zahlungsverzug Kunde
- Manuell oder automatisch auslösbar

**Marktereignisse:**
- Preissteigerung
- Nachfragespitzen
- Saisonschlussverkauf
- Lieferantenstreik
- Neuer Wettbewerber
- Produkt-Trends

**Lehrer-Dashboard:**
- Unternehmensübersicht (Balance, XP, Reputation, Stats)
- Top-Performer-Liste
- Aktive Störungen & Events
- Rankings (Gewinn, Qualität, Kundenzufriedenheit, Umsatz)
- Aktivitätenprotokoll

#### 5. **Kalkulationen (calculations.ts)**

**Bezugskalkulation:**
```
Listeneinkaufspreis (LEP)
- Rabatt
= Zieleinkaufspreis (ZEP)
- Liefererskonto
= Bareinkaufspreis (BEP)
+ Bezugskosten
= Bezugspreis/Einstandspreis
```

**Handelskalkulation Vorwärts:**
```
Bezugspreis
+ Handlungskostenzuschlag
= Selbstkosten
+ Gewinnzuschlag
= Barverkaufspreis
+ Kundenskonto
= Zielverkaufspreis
+ Kundenrabatt
= Listenverkaufspreis netto
+ Vertreterprovision
= LVP (mit Provision)
+ Mehrwertsteuer
= Listenverkaufspreis brutto
```

**Handelskalkulation Rückwärts:**
- Umkehrung der Vorwärtskalkulation
- Vom Brutto-VKP zum Bezugspreis

**Deckungsbeitragsrechnung:**
- DB/Stück = VKP - variable Kosten
- Betriebsergebnis = DB gesamt - Fixkosten
- Preisuntergrenzen (kurzfristig/langfristig)

**Break-Even-Point:**
- Gewinnschwellenmenge = Fixkosten / DB pro Stück
- Gewinnschwellenumsatz

**Hilfsfunktionen:**
- Währungsformatierung
- Prozent-Formatierung
- Validierung mit Toleranz

---

## 🚧 Nächste Schritte

### Phase 1: UI-Grundlagen
1. **Dashboard-Komponenten**
   - Unternehmensübersicht
   - Lagerbestand-Anzeige
   - Auftragsübersicht
   - XP/Level-Anzeige

2. **Lobby-Erweiterung**
   - Unternehmenserstellung/-auswahl
   - Lernbereich-Einstellungen für Lehrkraft

### Phase 2: Einkaufsmodul
3. **Lieferanten-Katalog**
   - Lieferantensuche
   - Produktkatalog anzeigen
   - Konditionen vergleichen

4. **Bestellprozess**
   - Anfrage erstellen
   - Angebote vergleichen (Nutzwertanalyse)
   - Bestellung aufgeben
   - Auftragsbestätigung prüfen

5. **Wareneingang**
   - Lieferung annehmen
   - Lieferschein prüfen
   - Lagerbestand aktualisieren
   - Reklamationen erstellen

6. **Rechnungsprüfung**
   - Eingangsrechnung prüfen (sachlich & rechnerisch)
   - Fehler finden und korrigieren
   - Buchung durchführen
   - Zahlung veranlassen (mit/ohne Skonto)

### Phase 3: Verkaufsmodul
7. **Kundenanfragen**
   - Anfragen entgegennehmen
   - Lieferfähigkeit prüfen
   - Angebot erstellen

8. **Auftragsabwicklung**
   - Bestellung annehmen
   - Ware reservieren/entnehmen
   - Lieferschein erstellen
   - Versand veranlassen

9. **Fakturierung**
   - Ausgangsrechnung erstellen
   - Zahlungseingang überwachen
   - Buchung durchführen

### Phase 4: Weitere Module
10. **Kaufvertragsstörungen-System**
11. **Prüfungsmodus**
12. **Controlling-Dashboard**

---

## 🗂️ Dateistruktur

```
src/
├── types/
│   └── firestore.ts          ✅ Alle Datenmodelle
├── lib/
│   ├── firebase.ts            ⏸️ Firebase-Konfiguration
│   ├── templates.ts           ✅ Produkte, Lieferanten, Mail-Templates
│   ├── xpSystem.ts           ✅ XP, Level, Badges
│   ├── teacherControls.ts    ✅ Lehrkraft-Features
│   └── calculations.ts       ✅ Alle Kalkulationsfunktionen
├── app/
│   ├── dashboard/
│   │   └── page.tsx          🚧 Haupt-Dashboard
│   ├── lobby/
│   │   ├── [lobbyId]/
│   │   │   └── page.tsx      🚧 Lobby-Details
│   │   └── new/
│   │       └── page.tsx      🚧 Neue Lobby erstellen
│   └── play/
│       └── [pin]/
│           └── page.tsx      🚧 Spielansicht
└── pdf/
    └── LIS_PDF_12-01-2026.pdf ✅ Lehrplan
```

**Legende:**
- ✅ Abgeschlossen
- 🚧 In Arbeit / Placeholder vorhanden
- ⏸️ Existiert, muss noch angepasst werden

---

## 🎮 Spielmechanik

### Spielstart
1. Lehrkraft erstellt Lobby mit PIN
2. Lehrkraft konfiguriert Lernbereiche
3. Schüler treten Lobby bei
4. Schüler wählen/gründen Unternehmen oder werden eingeteilt
5. Unternehmen erhalten Startkapital

### Spielablauf (endlos)
1. **Einkauf:** Waren beim Lieferanten bestellen
2. **Lager:** Wareneingang prüfen, einlagern
3. **Verkauf:** Kundenaufträge bearbeiten
4. **Kalkulation:** Preise kalkulieren
5. **Buchung:** Geschäftsvorfälle buchen
6. **Controlling:** Kennzahlen prüfen, optimieren
7. **Störungen:** Auf Probleme reagieren
8. **XP sammeln:** Level aufsteigen, Badges freischalten

### Wettbewerb
- Unternehmen konkurrieren am Markt
- Rankings nach Gewinn, Qualität, Kundenzufriedenheit
- Handel zwischen Unternehmen möglich
- Marktereignisse beeinflussen alle

---

## 💡 Besonderheiten

### Realitätsnähe
- Vollständige Kalkulationen (nicht vereinfacht!)
- Echte Geschäftsprozesse
- Korrekte kaufmännische Begriffe
- Berücksichtigung aller Lehrplan-Anforderungen

### Gamification
- XP für korrekte Aktionen
- Level-System mit Fortschrittsbalken
- Badges als Anreiz
- Unternehmens-Rankings
- Reputation-System

### Lehrerkontrolle
- Feingranulare Steuerung der Lernbereiche
- Störungen gezielt auslösen
- Markt beeinflussen
- Echtzeit-Übersicht über alle Schüler
- Export-Funktionen für Bewertung

---

## 📝 Offene Fragen / TODOs

- [ ] Soll es einen Zeitfaktor geben? (z.B. 1 Spieltag = 1 Woche im Spiel?)
- [ ] Maximale Anzahl Spieler pro Lobby?
- [ ] Maximale Anzahl Unternehmen pro Lobby?
- [ ] Startkapital-Höhe? (vorgeschlagen: 10.000 €)
- [ ] Sollen NPCs automatisch Bestellungen aufgeben?
- [ ] Wie oft erscheinen zufällige Marktereignisse?
- [ ] Schwierigkeitsgrade: Was unterscheidet Easy/Medium/Hard?
- [ ] Soll es einen Tutorial/Onboarding-Flow geben?

---

## 🎯 Ziel für nächste Session

**Option A (UI-Fokus):**
- Dashboard mit Unternehmensübersicht bauen
- Lobby-Erstellung mit Lernbereich-Settings

**Option B (Backend-Fokus):**
- Firebase Cloud Functions für automatische Prozesse
- Einkaufsmodul Backend-Logik

**Option C (Feature-Fokus):**
- Komplettes Einkaufsmodul (UI + Logik) prototypen

Was bevorzugst du?
