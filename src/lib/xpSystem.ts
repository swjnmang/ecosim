// src/lib/xpSystem.ts
// Erfahrungspunkte-System für Schüler und Unternehmen

export const XP_REWARDS = {
  // Einkauf
  ANFRAGE_ERSTELLT: 5,
  ANGEBOT_VERGLICHEN: 10,
  BESTELLUNG_KORREKT: 15,
  WARENEINGANG_GEPRUEFT: 10,
  RECHNUNG_KORREKT_GEPRUEFT: 20,
  BEZUGSKALKULATION_KORREKT: 25,
  
  // Verkauf
  KUNDENANFRAGE_BEARBEITET: 5,
  ANGEBOT_ERSTELLT: 10,
  AUFTRAGSBESTAETIGUNG_KORREKT: 15,
  LIEFERSCHEIN_ERSTELLT: 10,
  RECHNUNG_ERSTELLT: 15,
  HANDELSKALKULATION_KORREKT: 25,
  
  // Buchung
  BUCHUNGSSATZ_KORREKT: 15,
  BELEG_KORREKT_VORKONTIERT: 20,
  FEHLER_IN_RECHNUNG_GEFUNDEN: 25,
  
  // Störungen
  MAHNUNG_KORREKT_GESCHRIEBEN: 30,
  REKLAMATION_BEARBEITET: 25,
  LIEFERVERZUG_BEHANDELT: 20,
  
  // Controlling
  DECKUNGSBEITRAG_BERECHNET: 30,
  BREAK_EVEN_ERMITTELT: 35,
  KENNZAHLEN_ANALYSIERT: 20,
  
  // Prüfungen
  PRUEFUNG_BESTANDEN: 50,
  PERFEKTE_PRUEFUNG: 100, // Alle Fragen richtig
};

// Level-System: Wieviel XP für nächstes Level
export function getXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

// Berechne Level aus XP
export function getLevelFromXP(xp: number): number {
  let level = 1;
  let requiredXP = 0;
  
  while (xp >= requiredXP + getXPForLevel(level)) {
    requiredXP += getXPForLevel(level);
    level++;
  }
  
  return level;
}

// Berechne Fortschritt zum nächsten Level
export function getProgressToNextLevel(xp: number): {
  currentLevel: number;
  nextLevel: number;
  currentXP: number;
  requiredXP: number;
  percentage: number;
} {
  const currentLevel = getLevelFromXP(xp);
  const requiredForNext = getXPForLevel(currentLevel);
  
  let xpInCurrentLevel = xp;
  for (let i = 1; i < currentLevel; i++) {
    xpInCurrentLevel -= getXPForLevel(i);
  }
  
  return {
    currentLevel,
    nextLevel: currentLevel + 1,
    currentXP: xpInCurrentLevel,
    requiredXP: requiredForNext,
    percentage: Math.round((xpInCurrentLevel / requiredForNext) * 100),
  };
}

// Badges die vergeben werden können
export const BADGES = {
  EINKAUF_ROOKIE: { id: 'einkauf_rookie', name: 'Einkauf Rookie', description: '10 erfolgreiche Bestellungen', requirement: { type: 'einkauf_count', value: 10 } },
  EINKAUF_PRO: { id: 'einkauf_pro', name: 'Einkauf Profi', description: '50 erfolgreiche Bestellungen', requirement: { type: 'einkauf_count', value: 50 } },
  VERKAUF_ROOKIE: { id: 'verkauf_rookie', name: 'Verkauf Rookie', description: '10 erfolgreiche Verkäufe', requirement: { type: 'verkauf_count', value: 10 } },
  VERKAUF_PRO: { id: 'verkauf_pro', name: 'Verkauf Profi', description: '50 erfolgreiche Verkäufe', requirement: { type: 'verkauf_count', value: 50 } },
  BUCHUNGSMEISTER: { id: 'buchungsmeister', name: 'Buchungsmeister', description: '100 korrekte Buchungssätze', requirement: { type: 'buchung_count', value: 100 } },
  KALKULATIONS_GENIE: { id: 'kalkulations_genie', name: 'Kalkulationsgenie', description: '25 perfekte Kalkulationen', requirement: { type: 'kalkulation_perfect', value: 25 } },
  FEHLERDETEKTIV: { id: 'fehlerdetektiv', name: 'Fehler-Detektiv', description: '20 Fehler in Rechnungen gefunden', requirement: { type: 'error_found', value: 20 } },
  MAHNUNGSPROFI: { id: 'mahnungsprofi', name: 'Mahnungsprofi', description: '15 korrekte Mahnungen geschrieben', requirement: { type: 'mahnung_count', value: 15 } },
  LEVEL_10: { id: 'level_10', name: 'Level 10 erreicht', description: 'Erreiche Level 10', requirement: { type: 'level', value: 10 } },
  LEVEL_25: { id: 'level_25', name: 'Level 25 erreicht', description: 'Erreiche Level 25', requirement: { type: 'level', value: 25 } },
  PERFEKTIONIST: { id: 'perfektionist', name: 'Perfektionist', description: 'Prüfung mit 100% bestanden', requirement: { type: 'exam_perfect', value: 1 } },
};

// Prüfe ob ein Badge verdient wurde
export function checkBadgeEligibility(
  badge: typeof BADGES[keyof typeof BADGES],
  playerStats: Record<string, number>
): boolean {
  const { type, value } = badge.requirement;
  return (playerStats[type] || 0) >= value;
}
