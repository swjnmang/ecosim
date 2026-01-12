// src/lib/teacherControls.ts
// Funktionen für Lehrkraft-Steuerung und Admin-Features

import { Lobby, ContractDisturbance, MarketEvent } from '@/types/firestore';

// ========== LERNBEREICH-KONFIGURATION ==========

export interface LearningModuleConfig {
  einkauf: {
    enabled: boolean;
    submodules: {
      lieferantensuche: boolean;
      angebotsvergleich: boolean;
      bestellung: boolean;
      wareneingang: boolean;
      rechnungspruefung: boolean;
      bezugskalkulation: boolean;
    };
  };
  verkauf: {
    enabled: boolean;
    submodules: {
      anfragen: boolean;
      angebote: boolean;
      auftragsbestaetigung: boolean;
      lieferschein: boolean;
      rechnungserstellung: boolean;
      zahlungsueberwachung: boolean;
      handelskalkulation: boolean;
    };
  };
  marketing: {
    enabled: boolean;
    submodules: {
      preispolitik: boolean;
      werbemassnahmen: boolean;
      socialMedia: boolean;
    };
  };
  controlling: {
    enabled: boolean;
    submodules: {
      kalkulation: boolean;
      deckungsbeitrag: boolean;
      breakEven: boolean;
      kennzahlen: boolean;
    };
  };
  finanzen: {
    enabled: boolean;
    submodules: {
      buchungssaetze: boolean;
      belegpruefung: boolean;
      bilanzierung: boolean;
    };
  };
  kaufvertragsstoerungen: {
    enabled: boolean;
    submodules: {
      lieferverzug: boolean;
      schlechtleistung: boolean;
      zahlungsverzug: boolean;
      mahnungen: boolean;
    };
  };
}

export const DEFAULT_MODULE_CONFIG: LearningModuleConfig = {
  einkauf: {
    enabled: true,
    submodules: {
      lieferantensuche: true,
      angebotsvergleich: true,
      bestellung: true,
      wareneingang: true,
      rechnungspruefung: true,
      bezugskalkulation: true,
    },
  },
  verkauf: {
    enabled: true,
    submodules: {
      anfragen: true,
      angebote: true,
      auftragsbestaetigung: true,
      lieferschein: true,
      rechnungserstellung: true,
      zahlungsueberwachung: true,
      handelskalkulation: true,
    },
  },
  marketing: {
    enabled: false,
    submodules: {
      preispolitik: false,
      werbemassnahmen: false,
      socialMedia: false,
    },
  },
  controlling: {
    enabled: true,
    submodules: {
      kalkulation: true,
      deckungsbeitrag: true,
      breakEven: true,
      kennzahlen: true,
    },
  },
  finanzen: {
    enabled: true,
    submodules: {
      buchungssaetze: true,
      belegpruefung: true,
      bilanzierung: false,
    },
  },
  kaufvertragsstoerungen: {
    enabled: true,
    submodules: {
      lieferverzug: true,
      schlechtleistung: true,
      zahlungsverzug: true,
      mahnungen: true,
    },
  },
};

// ========== STÖRUNGEN AUSLÖSEN ==========

export const DISTURBANCE_TEMPLATES = {
  lieferverzug: {
    title: 'Lieferverzug',
    descriptions: [
      'Lieferant kann den vereinbarten Liefertermin nicht einhalten. Neue Lieferung in 7 Tagen.',
      'Ware ist auf Transport verloren gegangen. Ersatzlieferung erfolgt in 5 Tagen.',
      'Lieferant hat Produktionsengpass. Lieferung verzögert sich um 10 Tage.',
    ],
    severity: 'medium' as const,
    requiredActions: ['Lieferanten kontaktieren', 'Nachliefertermin festlegen', 'Ggf. Kunden informieren'],
  },
  schlechtleistung_menge: {
    title: 'Falsche Liefermenge',
    descriptions: [
      'Gelieferte Menge weicht von bestellter Menge ab (zu wenig geliefert).',
      'Teillieferung ohne vorherige Absprache erfolgt.',
      'Überlieferung: Es wurde mehr geliefert als bestellt.',
    ],
    severity: 'medium' as const,
    requiredActions: ['Lieferschein prüfen', 'Mängelrüge schreiben', 'Nachlieferung oder Gutschrift fordern'],
  },
  schlechtleistung_qualitaet: {
    title: 'Mangelhafte Qualität',
    descriptions: [
      'Ware ist beschädigt angekommen (Transportschaden).',
      'Produkt entspricht nicht der vereinbarten Qualität.',
      'Ware ist mit Mängeln behaftet und nicht verkaufsfähig.',
    ],
    severity: 'high' as const,
    requiredActions: ['Wareneingangsprüfung dokumentieren', 'Mängelrüge unverzüglich erstellen', 'Rücksendung oder Ersatzlieferung vereinbaren'],
  },
  schlechtleistung_art: {
    title: 'Falsche Ware geliefert',
    descriptions: [
      'Lieferant hat ein falsches Produkt geliefert.',
      'Falsche Farbe/Größe geliefert.',
      'Artikel mit falscher Artikelnummer im Paket.',
    ],
    severity: 'high' as const,
    requiredActions: ['Falschlieferung dokumentieren', 'Mängelrüge schreiben', 'Korrekte Ware nachfordern'],
  },
  zahlungsverzug_kunde: {
    title: 'Zahlungsverzug des Kunden',
    descriptions: [
      'Kunde hat Rechnung trotz Fälligkeit nicht bezahlt.',
      'Kunde beansprucht Skonto nach Ablauf der Frist.',
      'Teilzahlung erfolgt ohne Absprache.',
    ],
    severity: 'medium' as const,
    requiredActions: ['Zahlungserinnerung senden', 'Mahnung mit Mahngebühren erstellen', 'Zahlungsziel setzen'],
  },
};

export function createDisturbance(
  type: keyof typeof DISTURBANCE_TEMPLATES,
  orderId: string,
  orderType: 'purchase' | 'sales',
  triggeredBy: 'system' | 'teacher'
): Omit<ContractDisturbance, 'id' | 'lobbyId' | 'createdAt'> {
  const template = DISTURBANCE_TEMPLATES[type];
  const randomDescription = template.descriptions[Math.floor(Math.random() * template.descriptions.length)];
  
  return {
    type: type.includes('lieferverzug') ? 'lieferverzug' :
          type.includes('zahlungsverzug') ? 'zahlungsverzug' :
          'schlechtleistung',
    orderId,
    orderType,
    triggeredBy,
    description: randomDescription,
    severity: template.severity,
    status: 'active',
    requiredActions: template.requiredActions,
  };
}

// ========== MARKTEREIGNISSE ==========

export const MARKET_EVENT_TEMPLATES = {
  price_increase: {
    title: 'Preissteigerung bei Rohstoffen',
    description: 'Aufgrund gestiegener Rohstoffpreise erhöhen Lieferanten ihre Preise um 5-15%.',
    impact: { priceChange: 10 },
  },
  demand_spike: {
    title: 'Erhöhte Nachfrage',
    description: 'Durch Trend in sozialen Medien steigt die Nachfrage nach bestimmten Produkten stark an.',
    impact: { demandChange: 50 },
  },
  seasonal_sale: {
    title: 'Saisonschlussverkauf',
    description: 'Ende der Saison: Viele Kunden erwarten Rabatte auf Sportartikel.',
    impact: { demandChange: 30, priceChange: -15 },
  },
  supplier_strike: {
    title: 'Streik beim Lieferanten',
    description: 'Streik bei einem großen Lieferanten führt zu Verzögerungen.',
    impact: { deliveryDelays: 7 },
  },
  competitor_entry: {
    title: 'Neuer Wettbewerber',
    description: 'Ein neues Unternehmen tritt in den Markt ein und bietet günstige Preise.',
    impact: { priceChange: -8, demandChange: -20 },
  },
  trend_sneaker: {
    title: 'Sneaker-Trend',
    description: 'Influencer tragen bestimmte Sneaker-Modelle, Nachfrage explodiert.',
    impact: { demandChange: 80 },
  },
};

export function createMarketEvent(
  type: keyof typeof MARKET_EVENT_TEMPLATES,
  affectedProducts?: string[],
  affectedSuppliers?: string[],
  triggeredBy: 'system' | 'teacher' = 'system'
): Omit<MarketEvent, 'id' | 'lobbyId' | 'createdAt'> {
  const template = MARKET_EVENT_TEMPLATES[type];
  
  // Bestimme Event-Type basierend auf dem Template-Key
  let eventType: MarketEvent['type'];
  if (type.includes('price')) {
    eventType = 'price-change';
  } else if (type.includes('demand')) {
    eventType = (template.impact.demandChange && template.impact.demandChange > 0) ? 'demand-spike' : 'demand-drop';
  } else if (type.includes('supplier')) {
    eventType = 'supplier-issue';
  } else if (type.includes('competitor')) {
    eventType = 'new-competitor';
  } else {
    eventType = 'trend';
  }
  
  return {
    type: eventType,
    title: template.title,
    description: template.description,
    affectedProducts,
    affectedSuppliers,
    impact: template.impact,
    startDate: new Date(),
    isActive: true,
    triggeredBy,
  };
}

// ========== LEHRER-DASHBOARD ==========

export interface TeacherDashboardData {
  lobby: Lobby;
  companies: {
    id: string;
    name: string;
    balance: number;
    experience: number;
    reputation: number;
    stats: {
      errorRate: number;
      customerSatisfaction: number;
      revenue: number;
      profit: number;
    };
    employeeCount: number;
  }[];
  topPerformers: {
    sessionId: string;
    displayName: string;
    companyName: string;
    experience: number;
    level: number;
    recentAchievements: string[];
  }[];
  activeDisturbances: ContractDisturbance[];
  activeMarketEvents: MarketEvent[];
  recentActivities: {
    timestamp: Date;
    sessionId: string;
    displayName: string;
    action: string;
    success: boolean;
  }[];
}

// Berechne Rankings
export function calculateCompanyRankings(companies: TeacherDashboardData['companies']) {
  return {
    byProfit: [...companies].sort((a, b) => b.stats.profit - a.stats.profit),
    byQuality: [...companies].sort((a, b) => a.stats.errorRate - b.stats.errorRate),
    byCustomerSatisfaction: [...companies].sort((a, b) => b.stats.customerSatisfaction - a.stats.customerSatisfaction),
    byRevenue: [...companies].sort((a, b) => b.stats.revenue - a.stats.revenue),
  };
}
