// Eigenständiger Produktkatalog Fahrrad- & E-Bike-Zubehör.
// qualitySpecs sind bewusst je Kategorie unterschiedlich (Materialgüte,
// Ladezyklen, Reichweite, Wetterfestigkeit) - Grundlage für Marktereignisse
// und Kalkulationsübungen laut KONZEPT.md Abschnitt 7.

export const products = [
  // Schlösser
  {
    name: "Bügelschloss SecuBlock 90",
    category: "Schlösser",
    description: "Massives Bügelschloss, Sicherheitsstufe hoch",
    qualitySpecs: { materialguete: 5, sicherheitsstufe: "hoch", gewichtGramm: 1450 },
    listPurchasePrice: 22.0,
    listSalePrice: 44.99,
  },
  {
    name: "Faltschloss FlexGuard 85",
    category: "Schlösser",
    description: "Kompaktes Faltschloss für unterwegs",
    qualitySpecs: { materialguete: 4, sicherheitsstufe: "mittel", gewichtGramm: 780 },
    listPurchasePrice: 15.5,
    listSalePrice: 32.99,
  },
  {
    name: "Kettenschloss RouteLock 120",
    category: "Schlösser",
    description: "Lange Kette für flexible Absicherung mehrerer Räder",
    qualitySpecs: { materialguete: 4, sicherheitsstufe: "mittel", gewichtGramm: 1200 },
    listPurchasePrice: 18.0,
    listSalePrice: 36.99,
  },

  // Beleuchtung
  {
    name: "LED-Frontlicht BeamRunner 60",
    category: "Beleuchtung",
    description: "60-Lux-Frontlicht mit Standlichtfunktion",
    qualitySpecs: { lumen: 60, akkulaufzeitStunden: 8, wetterfest: true },
    listPurchasePrice: 12.0,
    listSalePrice: 26.99,
  },
  {
    name: "Rücklicht SafeGlow Duo",
    category: "Beleuchtung",
    description: "Rücklicht mit Bremslicht-Simulation",
    qualitySpecs: { lumen: 20, akkulaufzeitStunden: 12, wetterfest: true },
    listPurchasePrice: 9.0,
    listSalePrice: 19.99,
  },
  {
    name: "Beleuchtungsset NightPath Pro",
    category: "Beleuchtung",
    description: "Front- und Rücklicht im Set, StVZO-konform",
    qualitySpecs: { lumen: 80, akkulaufzeitStunden: 10, wetterfest: true },
    listPurchasePrice: 24.0,
    listSalePrice: 49.99,
  },

  // Akkus & Ladetechnik (E-Bike)
  {
    name: "E-Bike-Akku PowerCell 500",
    category: "Akkus & Ladetechnik",
    description: "Wechselakku für gängige Mittelmotor-Systeme",
    qualitySpecs: { kapazitaetWh: 500, ladezyklen: 800, reichweiteKm: 70 },
    listPurchasePrice: 340.0,
    listSalePrice: 599.0,
  },
  {
    name: "E-Bike-Akku PowerCell 750 XL",
    category: "Akkus & Ladetechnik",
    description: "Große Reichweite für Trekking- und Lastenräder",
    qualitySpecs: { kapazitaetWh: 750, ladezyklen: 900, reichweiteKm: 110 },
    listPurchasePrice: 480.0,
    listSalePrice: 849.0,
  },
  {
    name: "Schnellladegerät VoltCharge 4A",
    category: "Akkus & Ladetechnik",
    description: "Ladegerät mit verkürzter Ladezeit",
    qualitySpecs: { ladezeitStunden: 2.5, kompatibilitaet: "universal" },
    listPurchasePrice: 45.0,
    listSalePrice: 89.99,
  },

  // Gepäckträger & Taschen
  {
    name: "Gepäckträger CarryFrame Alu",
    category: "Gepäckträger & Taschen",
    description: "Aluminium-Gepäckträger, hohe Zuladung",
    qualitySpecs: { materialguete: 5, maxZuladungKg: 25 },
    listPurchasePrice: 19.0,
    listSalePrice: 39.99,
  },
  {
    name: "Gepäcktasche UrbanCarrier 20L",
    category: "Gepäckträger & Taschen",
    description: "Wasserabweisende Doppeltasche für den Gepäckträger",
    qualitySpecs: { volumenLiter: 20, wetterfest: true },
    listPurchasePrice: 26.0,
    listSalePrice: 54.99,
  },

  // Reifen & Schläuche
  {
    name: "Reifen TrailGrip 28 Zoll",
    category: "Reifen & Schläuche",
    description: "Pannenschutz-Reifen für Trekking- und E-Bikes",
    qualitySpecs: { materialguete: 4, pannenschutz: true, groesseZoll: 28 },
    listPurchasePrice: 16.5,
    listSalePrice: 34.99,
  },
  {
    name: "Schlauch FlexTube 28 Zoll",
    category: "Reifen & Schläuche",
    description: "Standardschlauch mit Autoventil",
    qualitySpecs: { materialguete: 3, groesseZoll: 28 },
    listPurchasePrice: 3.2,
    listSalePrice: 7.99,
  },

  // Weiteres Zubehör
  {
    name: "Fahrradständer StandFirm Alu",
    category: "Zubehör",
    description: "Hinterbauständer, stufenlos verstellbar",
    qualitySpecs: { materialguete: 4, verstellbar: true },
    listPurchasePrice: 8.5,
    listSalePrice: 17.99,
  },
  {
    name: "Klingel RingTone Classic",
    category: "Zubehör",
    description: "Messingklingel mit klarem Klang",
    qualitySpecs: { materialguete: 5, lautstaerkeDb: 80 },
    listPurchasePrice: 3.0,
    listSalePrice: 7.49,
  },
] as const;
