// src/lib/templates.ts
import { Template, Product, Supplier } from '@/types/firestore';

// ========== EMAIL & BRIEF TEMPLATES ==========

export const defaultTemplates: Template[] = [
  {
    id: 'mail_auftragsbestaetigung',
    type: 'mail',
    locale: 'de',
    body: `Sehr {{anrede}},

vielen Dank für Ihre Bestellung vom {{datum}}.

Bestellnummer: {{bestellnummer}}
Produktname: {{produkt}}
Menge: {{menge}}
Gesamtpreis: {{gesamtpreis}} EUR

Wir werden die Ware schnellstmöglich bearbeiten und versenden.

Mit freundlichen Grüßen
Ihr Verkaufsteam`,
    variables: ['anrede', 'datum', 'bestellnummer', 'produkt', 'menge', 'gesamtpreis'],
  },
  {
    id: 'brief_mahnung',
    type: 'mahnung',
    locale: 'de',
    body: `Sehr {{anrede}},

trotz mehrfacher Zahlungsaufforderungen haben wir Ihre Zahlung für folgende Rechnung noch nicht erhalten:

Rechnungsnummer: {{rechnungsnr}}
Fälligkeitsdatum: {{faelligkeitsdatum}}
Betrag: {{betrag}} EUR

Wir bitten Sie hiermit eindringlich, den ausstehenden Betrag innerhalb von {{tage}} Tagen auf unser Konto zu überweisen.

Sollten Sie die Zahlung bereits geleistet haben, bitten wir um Entschuldigung.

Mit freundlichen Grüßen
{{absender}}`,
    variables: ['anrede', 'rechnungsnr', 'faelligkeitsdatum', 'betrag', 'tage', 'absender'],
  },
  {
    id: 'mail_bestellung_eingang',
    type: 'mail',
    locale: 'de',
    body: `Sehr {{anrede}},

wir bestätigen den Eingang Ihrer Bestellung:

Bestellnummer: {{bestellnummer}}
Artikel: {{artikel}}
Menge: {{menge}}
Bestelldatum: {{bestelldatum}}

Für Rückfragen stehen wir Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen
Einkaufsteam`,
    variables: ['anrede', 'bestellnummer', 'artikel', 'menge', 'bestelldatum'],
  },
];

// ========== SPORTARTIKEL PRODUKTKATALOG ==========

export const defaultProducts: Product[] = [
  // SCHUHE
  {
    id: 'prod_shoe_001',
    category: 'schuhe',
    name: 'ProRun Laufschuh',
    description: 'Professioneller Laufschuh mit Dämpfung und Stabilität',
    brand: 'SportTech',
    basePrice: 45.00,
    recommendedRetailPrice: 89.99,
    attributes: {
      size: '38-46',
      color: ['Schwarz', 'Weiß', 'Blau'],
      material: 'Mesh/Synthetik',
      weight: 0.28,
    },
  },
  {
    id: 'prod_shoe_002',
    category: 'schuhe',
    name: 'TrailMaster Wanderschuh',
    description: 'Robuster Wanderschuh für anspruchsvolle Touren',
    brand: 'MountainPro',
    basePrice: 55.00,
    recommendedRetailPrice: 119.99,
    attributes: {
      size: '39-47',
      color: ['Braun', 'Grau', 'Grün'],
      material: 'Leder/Synthetik',
      weight: 0.45,
    },
  },
  {
    id: 'prod_shoe_003',
    category: 'schuhe',
    name: 'CourtKing Tennisschuh',
    description: 'Wendiger Tennisschuh für Sandplatz und Hartplatz',
    brand: 'AceSports',
    basePrice: 38.00,
    recommendedRetailPrice: 74.99,
    attributes: {
      size: '36-44',
      color: ['Weiß', 'Blau/Weiß'],
      material: 'Synthetik',
      weight: 0.32,
    },
  },

  // SNEAKER
  {
    id: 'prod_sneaker_001',
    category: 'sneaker',
    name: 'Urban Classic Low',
    description: 'Klassischer Lifestyle-Sneaker für den Alltag',
    brand: 'StreetStyle',
    basePrice: 32.00,
    recommendedRetailPrice: 64.99,
    attributes: {
      size: '36-46',
      color: ['Weiß', 'Schwarz', 'Rot', 'Navy'],
      material: 'Canvas/Gummi',
      weight: 0.35,
    },
  },
  {
    id: 'prod_sneaker_002',
    category: 'sneaker',
    name: 'RetroWave High-Top',
    description: 'Retro-Sneaker im 80er-Jahre-Design',
    brand: 'VintageKicks',
    basePrice: 42.00,
    recommendedRetailPrice: 89.99,
    attributes: {
      size: '38-45',
      color: ['Schwarz/Gold', 'Weiß/Pink', 'Blau/Gelb'],
      material: 'Leder/Synthetik',
      weight: 0.42,
    },
  },

  // FUSSBÄLLE
  {
    id: 'prod_ball_001',
    category: 'fußbälle',
    name: 'MatchPro Fußball Gr. 5',
    description: 'Offizieller Trainingsball nach FIFA-Norm',
    brand: 'BallMaster',
    basePrice: 18.00,
    recommendedRetailPrice: 39.99,
    attributes: {
      size: 'Größe 5',
      color: ['Weiß/Schwarz', 'Gelb/Blau', 'Orange'],
      material: 'Kunstleder',
      weight: 0.43,
    },
  },
  {
    id: 'prod_ball_002',
    category: 'fußbälle',
    name: 'Youth Training Ball Gr. 4',
    description: 'Jugendtrainingsball für U14-Teams',
    brand: 'BallMaster',
    basePrice: 14.00,
    recommendedRetailPrice: 29.99,
    attributes: {
      size: 'Größe 4',
      color: ['Weiß/Blau', 'Gelb/Schwarz'],
      material: 'Kunstleder',
      weight: 0.38,
    },
  },
  {
    id: 'prod_ball_003',
    category: 'fußbälle',
    name: 'Indoor Futsal Pro',
    description: 'Spezieller Futsalball mit reduziertem Sprungverhalten',
    brand: 'IndoorSports',
    basePrice: 22.00,
    recommendedRetailPrice: 49.99,
    attributes: {
      size: 'Größe 4',
      color: ['Weiß/Rot', 'Gelb/Grün'],
      material: 'Spezial-Kunstleder',
      weight: 0.42,
    },
  },

  // SPORTKLEIDUNG
  {
    id: 'prod_cloth_001',
    category: 'sportkleidung',
    name: 'DryTech Running Shirt',
    description: 'Atmungsaktives Laufshirt mit Feuchtigkeitstransport',
    brand: 'SportTech',
    basePrice: 15.00,
    recommendedRetailPrice: 32.99,
    attributes: {
      size: 'XS-XXL',
      color: ['Schwarz', 'Weiß', 'Blau', 'Rot', 'Grün'],
      material: 'Polyester',
      weight: 0.15,
    },
  },
  {
    id: 'prod_cloth_002',
    category: 'sportkleidung',
    name: 'FlexFit Sport-Leggings',
    description: 'Elastische Trainingsleggings für maximale Bewegungsfreiheit',
    brand: 'ActiveWear',
    basePrice: 18.00,
    recommendedRetailPrice: 39.99,
    attributes: {
      size: 'XS-XL',
      color: ['Schwarz', 'Navy', 'Grau'],
      material: 'Elastan/Polyester',
      weight: 0.22,
    },
  },
  {
    id: 'prod_cloth_003',
    category: 'sportkleidung',
    name: 'Team Jersey Set',
    description: 'Komplett-Set: Trikot und Hose für Mannschaften',
    brand: 'TeamGear',
    basePrice: 28.00,
    recommendedRetailPrice: 59.99,
    attributes: {
      size: 'XS-XXL',
      color: ['Rot/Weiß', 'Blau/Weiß', 'Grün/Schwarz', 'Gelb/Schwarz'],
      material: 'Polyester',
      weight: 0.35,
    },
  },
  {
    id: 'prod_cloth_004',
    category: 'sportkleidung',
    name: 'Winter Training Jacket',
    description: 'Wasserdichte Trainingsjacke für kalte Tage',
    brand: 'WeatherPro',
    basePrice: 42.00,
    recommendedRetailPrice: 89.99,
    attributes: {
      size: 'S-XXL',
      color: ['Schwarz', 'Navy', 'Rot'],
      material: 'Nylon/Fleece',
      weight: 0.65,
    },
  },

  // SMARTWATCHES
  {
    id: 'prod_watch_001',
    category: 'smartwatches',
    name: 'FitTrack Pro 5',
    description: 'Fitness-Smartwatch mit Herzfrequenzmessung und GPS',
    brand: 'TechFit',
    basePrice: 85.00,
    recommendedRetailPrice: 179.99,
    attributes: {
      color: ['Schwarz', 'Silber', 'Roségold'],
      material: 'Aluminium/Silikon',
      weight: 0.048,
    },
  },
  {
    id: 'prod_watch_002',
    category: 'smartwatches',
    name: 'RunnerWatch Basic',
    description: 'Einfache Laufuhr mit Distanz- und Zeitmessung',
    brand: 'SportTime',
    basePrice: 45.00,
    recommendedRetailPrice: 89.99,
    attributes: {
      color: ['Schwarz', 'Blau', 'Grün'],
      material: 'Kunststoff',
      weight: 0.042,
    },
  },
  {
    id: 'prod_watch_003',
    category: 'smartwatches',
    name: 'MultiSport Elite',
    description: 'Premium-Smartwatch mit Multisport-Tracking und Wasserdichtigkeit',
    brand: 'ProAthlete',
    basePrice: 145.00,
    recommendedRetailPrice: 299.99,
    attributes: {
      color: ['Schwarz', 'Titan'],
      material: 'Titan/Saphirglas',
      weight: 0.062,
    },
  },
];

// ========== LIEFERANTEN ==========

export const defaultSuppliers: Supplier[] = [
  {
    id: 'supp_001',
    lobbyId: '', // Wird beim Erstellen der Lobby gesetzt
    name: 'SportGroßhandel Müller GmbH',
    legalForm: 'GmbH',
    address: {
      street: 'Industriestraße 42',
      postalCode: '80335',
      city: 'München',
      country: 'Deutschland',
    },
    contactPerson: 'Herr Thomas Müller',
    email: 'bestellung@sportmueller.de',
    phone: '+49 89 123456-0',
    paymentTerms: {
      daysNet: 30,
      discountPercent: 2,
      daysDiscount: 10,
    },
    deliveryTerms: {
      minOrderValue: 100,
      deliveryDays: 3,
      shippingCost: 7.90,
      freeShippingFrom: 500,
    },
    reliability: 95,
    productCatalog: [
      'prod_shoe_001', 'prod_shoe_003', 'prod_ball_001', 'prod_ball_002',
      'prod_cloth_001', 'prod_cloth_002', 'prod_cloth_003',
    ],
  },
  {
    id: 'supp_002',
    lobbyId: '',
    name: 'TechSport Import & Export AG',
    legalForm: 'AG',
    address: {
      street: 'Hafenweg 88',
      postalCode: '20459',
      city: 'Hamburg',
      country: 'Deutschland',
    },
    contactPerson: 'Frau Lisa Wagner',
    email: 'orders@techsport.de',
    phone: '+49 40 987654-0',
    paymentTerms: {
      daysNet: 14,
      discountPercent: 3,
      daysDiscount: 7,
    },
    deliveryTerms: {
      minOrderValue: 200,
      deliveryDays: 5,
      shippingCost: 9.90,
      freeShippingFrom: 750,
    },
    reliability: 88,
    productCatalog: [
      'prod_watch_001', 'prod_watch_002', 'prod_watch_003',
      'prod_sneaker_001', 'prod_sneaker_002',
    ],
  },
  {
    id: 'supp_003',
    lobbyId: '',
    name: 'Outdoor & More Handelsgesellschaft',
    legalForm: 'OHG',
    address: {
      street: 'Bergstraße 15',
      postalCode: '79098',
      city: 'Freiburg',
      country: 'Deutschland',
    },
    contactPerson: 'Herr Michael Schmidt',
    email: 'info@outdoormore.de',
    phone: '+49 761 555777-0',
    paymentTerms: {
      daysNet: 21,
      discountPercent: 2.5,
      daysDiscount: 10,
    },
    deliveryTerms: {
      minOrderValue: 150,
      deliveryDays: 4,
      shippingCost: 6.90,
      freeShippingFrom: 600,
    },
    reliability: 92,
    productCatalog: [
      'prod_shoe_002', 'prod_cloth_004', 'prod_ball_003',
    ],
  },
  {
    id: 'supp_004',
    lobbyId: '',
    name: 'UrbanStyle Sportswear Einzelhandel',
    legalForm: 'Einzelunternehmen',
    address: {
      street: 'Modestraße 23',
      postalCode: '10178',
      city: 'Berlin',
      country: 'Deutschland',
    },
    contactPerson: 'Frau Anna Klein',
    email: 'bestellung@urbanstyle-sport.de',
    phone: '+49 30 246810-0',
    paymentTerms: {
      daysNet: 14,
      discountPercent: 1.5,
      daysDiscount: 7,
    },
    deliveryTerms: {
      minOrderValue: 80,
      deliveryDays: 2,
      shippingCost: 5.90,
      freeShippingFrom: 400,
    },
    reliability: 98,
    productCatalog: [
      'prod_sneaker_001', 'prod_sneaker_002', 'prod_cloth_001',
      'prod_cloth_002', 'prod_shoe_001',
    ],
  },
];
