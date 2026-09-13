export const suppliers = [
  {
    name: "Nordkomponente Großhandel eG",
    city: "Bremen",
    conditions: { rabattPct: 5, skontoPct: 2, lieferzeitTage: 4 },
  },
  {
    name: "Alpin Radtechnik Import",
    city: "Garmisch-Partenkirchen",
    conditions: { rabattPct: 3, skontoPct: 1.5, lieferzeitTage: 6 },
  },
  {
    name: "EnergieRad Systeme AG",
    city: "Leipzig",
    conditions: { rabattPct: 4, skontoPct: 2, lieferzeitTage: 5 },
  },
  {
    name: "Rheinwerk Zubehörvertrieb",
    city: "Duisburg",
    conditions: { rabattPct: 6, skontoPct: 2.5, lieferzeitTage: 3 },
  },
] as const;
