// src/lib/calculations.ts
// Kalkulationsfunktionen für Bezugs- und Handelskalkulation

// ========== BEZUGSKALKULATION ==========

export interface BezugskalkulationInput {
  listeneinkaufspreis: number; // Listeneinkaufspreis (LEP)
  rabatt?: number; // Rabatt in %
  lieferantenSkonto?: number; // Liefererskonto in %
  bezugskosten?: number; // Bezugskosten (Transport, Fracht, Verpackung)
}

export interface BezugskalkulationResult {
  steps: {
    listeneinkaufspreis: number;
    rabatt: number;
    zieleinkaufspreis: number; // LEP - Rabatt = ZEP
    lieferantenSkonto: number;
    bareinkaufspreis: number; // ZEP - Skonto = BEP
    bezugskosten: number;
    bezugspreis: number; // BEP + Bezugskosten = BP (Einstandspreis)
  };
  einstandspreis: number; // = Bezugspreis
}

export function calculateBezugskalkulation(input: BezugskalkulationInput): BezugskalkulationResult {
  // Schritt 1: Listeneinkaufspreis
  const listeneinkaufspreis = input.listeneinkaufspreis;
  
  // Schritt 2: Rabatt abziehen
  const rabattBetrag = input.rabatt ? (listeneinkaufspreis * input.rabatt / 100) : 0;
  const zieleinkaufspreis = listeneinkaufspreis - rabattBetrag;
  
  // Schritt 3: Liefererskonto abziehen
  const skontoBetrag = input.lieferantenSkonto ? (zieleinkaufspreis * input.lieferantenSkonto / 100) : 0;
  const bareinkaufspreis = zieleinkaufspreis - skontoBetrag;
  
  // Schritt 4: Bezugskosten addieren
  const bezugskosten = input.bezugskosten || 0;
  const bezugspreis = bareinkaufspreis + bezugskosten;
  
  return {
    steps: {
      listeneinkaufspreis,
      rabatt: rabattBetrag,
      zieleinkaufspreis,
      lieferantenSkonto: skontoBetrag,
      bareinkaufspreis,
      bezugskosten,
      bezugspreis,
    },
    einstandspreis: bezugspreis,
  };
}

// ========== HANDELSKALKULATION (VORWÄRTSKALKULATION) ==========

export interface HandelskalkulationVorwaertsInput {
  bezugspreis: number; // Bezugspreis (= Einstandspreis)
  handlungskostenzuschlag: number; // in %
  gewinnzuschlag: number; // in %
  kundenskonto?: number; // Kundenskonto in %
  kundenrabatt?: number; // Kundenrabatt in %
  vertreterprovision?: number; // in %
  mehrwertsteuer: number; // MwSt in % (normalerweise 19%)
}

export interface HandelskalkulationVorwaertsResult {
  steps: {
    bezugspreis: number;
    handlungskosten: number; // HK-Zuschlag auf BP
    selbstkosten: number; // BP + HK
    gewinn: number; // Gewinnzuschlag auf SK
    barverkaufspreis: number; // SK + Gewinn
    kundenskonto: number;
    zielverkaufspreis: number; // BVP + Skonto
    kundenrabatt: number;
    listenverkaufspreis_netto: number; // ZVP + Rabatt
    vertreterprovision: number;
    listenverkaufspreis_provision: number; // LVPN + Provision
    mehrwertsteuer: number;
    listenverkaufspreis_brutto: number; // LVP + MwSt
  };
  verkaufspreis: number; // = Listenverkaufspreis brutto
}

export function calculateHandelskalkulationVorwaerts(input: HandelskalkulationVorwaertsInput): HandelskalkulationVorwaertsResult {
  const bp = input.bezugspreis;
  
  // Handlungskosten
  const hk = bp * (input.handlungskostenzuschlag / 100);
  const sk = bp + hk;
  
  // Gewinn
  const gewinn = sk * (input.gewinnzuschlag / 100);
  const bvp = sk + gewinn;
  
  // Kundenskonto
  const skonto = input.kundenskonto ? (bvp * input.kundenskonto / (100 - input.kundenskonto)) : 0;
  const zvp = bvp + skonto;
  
  // Kundenrabatt
  const rabatt = input.kundenrabatt ? (zvp * input.kundenrabatt / (100 - input.kundenrabatt)) : 0;
  const lvpNetto = zvp + rabatt;
  
  // Vertreterprovision
  const provision = input.vertreterprovision ? (lvpNetto * input.vertreterprovision / (100 - input.vertreterprovision)) : 0;
  const lvpProvision = lvpNetto + provision;
  
  // Mehrwertsteuer
  const mwst = lvpProvision * (input.mehrwertsteuer / 100);
  const lvpBrutto = lvpProvision + mwst;
  
  return {
    steps: {
      bezugspreis: bp,
      handlungskosten: hk,
      selbstkosten: sk,
      gewinn,
      barverkaufspreis: bvp,
      kundenskonto: skonto,
      zielverkaufspreis: zvp,
      kundenrabatt: rabatt,
      listenverkaufspreis_netto: lvpNetto,
      vertreterprovision: provision,
      listenverkaufspreis_provision: lvpProvision,
      mehrwertsteuer: mwst,
      listenverkaufspreis_brutto: lvpBrutto,
    },
    verkaufspreis: lvpBrutto,
  };
}

// ========== HANDELSKALKULATION (RÜCKWÄRTSKALKULATION) ==========

export interface HandelskalkulationRueckwaertsInput {
  listenverkaufspreis_brutto: number;
  mehrwertsteuer: number; // in %
  vertreterprovision?: number; // in %
  kundenrabatt?: number; // in %
  kundenskonto?: number; // in %
  gewinnzuschlag: number; // in %
  handlungskostenzuschlag: number; // in %
}

export interface HandelskalkulationRueckwaertsResult {
  steps: {
    listenverkaufspreis_brutto: number;
    mehrwertsteuer: number;
    listenverkaufspreis_provision: number;
    vertreterprovision: number;
    listenverkaufspreis_netto: number;
    kundenrabatt: number;
    zielverkaufspreis: number;
    kundenskonto: number;
    barverkaufspreis: number;
    gewinn: number;
    selbstkosten: number;
    handlungskosten: number;
    bezugspreis: number;
  };
  bezugspreis: number;
}

export function calculateHandelskalkulationRueckwaerts(input: HandelskalkulationRueckwaertsInput): HandelskalkulationRueckwaertsResult {
  const lvpBrutto = input.listenverkaufspreis_brutto;
  
  // MwSt abziehen
  const mwst = lvpBrutto * (input.mehrwertsteuer / (100 + input.mehrwertsteuer));
  const lvpProvision = lvpBrutto - mwst;
  
  // Provision abziehen
  const provision = input.vertreterprovision ? (lvpProvision * input.vertreterprovision / 100) : 0;
  const lvpNetto = lvpProvision - provision;
  
  // Rabatt abziehen
  const rabatt = input.kundenrabatt ? (lvpNetto * input.kundenrabatt / 100) : 0;
  const zvp = lvpNetto - rabatt;
  
  // Skonto abziehen
  const skonto = input.kundenskonto ? (zvp * input.kundenskonto / 100) : 0;
  const bvp = zvp - skonto;
  
  // Gewinn abziehen
  const gewinn = bvp * (input.gewinnzuschlag / (100 + input.gewinnzuschlag));
  const sk = bvp - gewinn;
  
  // Handlungskosten abziehen
  const hk = sk * (input.handlungskostenzuschlag / (100 + input.handlungskostenzuschlag));
  const bp = sk - hk;
  
  return {
    steps: {
      listenverkaufspreis_brutto: lvpBrutto,
      mehrwertsteuer: mwst,
      listenverkaufspreis_provision: lvpProvision,
      vertreterprovision: provision,
      listenverkaufspreis_netto: lvpNetto,
      kundenrabatt: rabatt,
      zielverkaufspreis: zvp,
      kundenskonto: skonto,
      barverkaufspreis: bvp,
      gewinn,
      selbstkosten: sk,
      handlungskosten: hk,
      bezugspreis: bp,
    },
    bezugspreis: bp,
  };
}

// ========== DIFFERENZKALKULATION ==========

export interface DifferenzkalkulationInput {
  bezugspreis: number;
  listenverkaufspreis_brutto: number;
  mehrwertsteuer: number;
  // Bekannte Größen
  handlungskostenzuschlag?: number;
  gewinnzuschlag?: number;
  kundenskonto?: number;
  kundenrabatt?: number;
}

// Bei Differenzkalkulation: Suche fehlenden Wert
export function calculateDifferenzkalkulation(
  input: DifferenzkalkulationInput,
  searchFor: 'gewinnzuschlag' | 'handlungskostenzuschlag'
): number {
  // Vereinfachte Berechnung - kann später erweitert werden
  // TODO: Vollständige Implementierung
  return 0;
}

// ========== DECKUNGSBEITRAGSRECHNUNG ==========

export interface DeckungsbeitragInput {
  verkaufspreis: number; // pro Stück
  variableKosten: number; // pro Stück
  absatzmenge: number; // Anzahl Stück
  fixkosten: number; // gesamt
}

export interface DeckungsbeitragResult {
  deckungsbeitragProStueck: number; // VKP - variable Kosten
  deckungsbeitragGesamt: number; // DB/Stück * Absatzmenge
  fixkosten: number;
  betriebsergebnis: number; // DB gesamt - Fixkosten
  preisuntergrenze_kurzfristig: number; // = variable Kosten
  preisuntergrenze_langfristig: number; // = (variable Kosten + Fixkosten) / Absatzmenge
}

export function calculateDeckungsbeitrag(input: DeckungsbeitragInput): DeckungsbeitragResult {
  const dbProStueck = input.verkaufspreis - input.variableKosten;
  const dbGesamt = dbProStueck * input.absatzmenge;
  const betriebsergebnis = dbGesamt - input.fixkosten;
  
  return {
    deckungsbeitragProStueck: dbProStueck,
    deckungsbeitragGesamt: dbGesamt,
    fixkosten: input.fixkosten,
    betriebsergebnis,
    preisuntergrenze_kurzfristig: input.variableKosten,
    preisuntergrenze_langfristig: (input.variableKosten * input.absatzmenge + input.fixkosten) / input.absatzmenge,
  };
}

// ========== BREAK-EVEN-POINT ==========

export interface BreakEvenInput {
  verkaufspreis: number; // pro Stück
  variableKosten: number; // pro Stück
  fixkosten: number; // gesamt
}

export interface BreakEvenResult {
  gewinnschwellenmenge: number; // x = Fixkosten / (VKP - var. Kosten)
  gewinnschwellenumsatz: number; // Gewinnschwellenmenge * VKP
  deckungsbeitragProStueck: number;
}

export function calculateBreakEven(input: BreakEvenInput): BreakEvenResult {
  const db = input.verkaufspreis - input.variableKosten;
  const gewinnschwellenmenge = input.fixkosten / db;
  const gewinnschwellenumsatz = gewinnschwellenmenge * input.verkaufspreis;
  
  return {
    gewinnschwellenmenge: Math.ceil(gewinnschwellenmenge), // Aufgerundet, da nur ganze Stücke
    gewinnschwellenumsatz,
    deckungsbeitragProStueck: db,
  };
}

// ========== HILFSFUNKTIONEN ==========

// Formatiere Währung
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

// Formatiere Prozent
export function formatPercent(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

// Runde auf 2 Nachkommastellen
export function roundCurrency(amount: number): number {
  return Math.round(amount * 100) / 100;
}

// Validiere Kalkulation (Prüfe ob Schüler-Antwort korrekt ist)
export function validateCalculation(
  correctResult: number,
  studentResult: number,
  tolerance: number = 0.01 // Toleranz in Euro
): boolean {
  return Math.abs(correctResult - studentResult) <= tolerance;
}
