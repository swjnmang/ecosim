// src/types/firestore.ts

export interface School {
  id: string; // Auto-generated
  name: string;
  numberOfStudents: number;
  contactEmail: string;
  adminId: string; // User ID of the school admin
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string; // Firebase Auth UID
  email: string;
  displayName?: string;
  role: 'developer' | 'school-admin' | 'teacher';
  schoolId?: string; // For school-admin and teacher roles
  createdBy?: string; // User ID who created this user
  isLegacy?: boolean; // For existing teacher accounts before the new system
  createdAt: Date;
  lastLoginAt: Date;
}

// Legacy type for backwards compatibility
export type Teacher = User;

export interface Lobby {
  id: string;
  pin: string; // 4-6 digit code (z.B. ABC123)
  name: string;
  teacherId: string; // Teacher.id (Firebase Auth UID)
  modules: {
    einkauf: boolean;
    verkauf: boolean;
    marketing: boolean;
    controlling: boolean;
    finanzen: boolean;
    kaufvertragsstoerungen: boolean;
  };
  submodules: {
    einkauf: {
      lieferantensuche: boolean;
      angebotsvergleich: boolean;
      bestellung: boolean;
      wareneingang: boolean;
      rechnungspruefung: boolean;
      bezugskalkulation: boolean;
    };
    verkauf: {
      anfragen: boolean;
      angebote: boolean;
      auftragsbestaetigung: boolean;
      lieferschein: boolean;
      rechnungserstellung: boolean;
      zahlungsueberwachung: boolean;
      handelskalkulation: boolean;
    };
    marketing: {
      preispolitik: boolean;
      werbemassnahmen: boolean;
      socialMedia: boolean;
    };
    controlling: {
      kalkulation: boolean;
      deckungsbeitrag: boolean;
      breakEven: boolean;
      kennzahlen: boolean;
    };
    finanzen: {
      buchungssaetze: boolean;
      belegpruefung: boolean;
      bilanzierung: boolean;
    };
    kaufvertragsstoerungen: {
      lieferverzug: boolean;
      schlechtleistung: boolean;
      zahlungsverzug: boolean;
      mahnungen: boolean;
    };
  };
  difficulty: 'easy' | 'medium' | 'hard';
  startBudget: number;
  marketSettings: {
    competitionEnabled: boolean;
    randomEventsEnabled: boolean;
    teacherCanTriggerEvents: boolean;
  };
  programsEnabled: {
    mail: boolean;
    textverarbeitung: boolean;
    lager: boolean;
    produktkatalog: boolean;
    buchung: boolean;
    banking: boolean;
    kalkulation: boolean;
    kundenverwaltung: boolean;
    lieferantenverwaltung: boolean;
  };
  hintsEnabled: boolean;
  hintStrength: 'light' | 'medium' | 'strong';
  createdAt: Date;
  lastActivityAt: Date;
  status: 'active' | 'archived'; // active = dauerhaft nutzbar, archived = versteckt
}

export interface Company {
  id: string;
  lobbyId: string;
  name: string;
  legalForm: 'Einzelunternehmen' | 'GmbH' | 'OHG' | 'KG' | 'AG';
  balance: number; // Kontostand
  experience: number; // Gesamt-XP des Unternehmens
  reputation: number; // 0-100
  createdAt: Date;
  employees: string[]; // PlayerSession IDs
  stats: {
    totalOrders: number;
    completedOrders: number;
    errorRate: number; // Fehlerquote in %
    customerSatisfaction: number; // 0-100
    revenue: number; // Umsatz
    profit: number; // Gewinn
  };
}

export interface PlayerSession {
  id: string;
  lobbyId: string;
  companyId?: string; // Zugehöriges Unternehmen (optional beim Erstellen)
  ownerUid?: string; // Firebase auth uid (optional)
  anonPlayerCode?: string; // Optional
  displayName?: string;
  role: 'Auszubildender' | 'Sachbearbeiter' | 'Abteilungsleiter'; // Kann später erweitert werden
  experience: number; // Persönliche XP
  level: number; // Berechnet aus experience
  badges: string[];
  progress: 'onboarding' | 'active' | 'finished';
  skills: {
    einkauf: number; // 0-100
    verkauf: number;
    kalkulation: number;
    buchung: number;
    marketing: number;
  };
  lastActiveAt: Date;
  createdAt: Date;
  deviceInfo?: {
    userAgent?: string;
  };
}

export interface Task {
  id: string;
  lobbyId: string;
  sessionId: string;
  companyId: string;
  type: 'einkauf' | 'verkauf' | 'buchung' | 'mahnung' | 'brief' | 'fehlerpruefung' | 'kalkulation' | 'angebotsvergleich' | 'wareneingang' | 'rechnungspruefung' | 'kaufvertragsstoerung';
  payload: Record<string, any>;
  status: 'open' | 'in-progress' | 'submitted' | 'graded';
  feedback?: {
    text: string;
    hints?: string[];
    isCorrect?: boolean;
    errors?: string[]; // Spezifische Fehler
  };
  pointsAwarded?: number;
  xpAwarded?: number; // Erfahrungspunkte
  seed?: number;
  createdAt: Date;
  startedAt?: Date;
  submittedAt?: Date;
  gradedAt?: Date;
}

export interface ProgramState {
  id: string;
  sessionId: string;
  lobbyId: string;
  program: 'mail' | 'textverarbeitung' | 'lager' | 'produktkatalog' | 'buchung' | 'banking';
  state: Record<string, any>;
  updatedAt: Date;
}

export interface Template {
  id: string;
  type: 'mail' | 'brief' | 'mahnung' | 'rechnung' | 'fehlerhaftRechnung';
  locale: 'de';
  body: string;
  variables: string[];
}

export interface Report {
  id: string;
  lobbyId: string;
  sessionId?: string;
  format: 'csv' | 'pdf';
  url: string;
  createdAt: Date;
}

// ========== NEUE DATENTYPEN FÜR UNTERNEHMENSSIMULATION ==========

export interface Product {
  id: string;
  category: 'schuhe' | 'fußbälle' | 'sportkleidung' | 'sneaker' | 'smartwatches';
  name: string;
  description: string;
  brand: string;
  basePrice: number; // Einkaufspreis vom Großhändler
  recommendedRetailPrice: number; // UVP
  imageUrl?: string;
  attributes: {
    size?: string; // z.B. "38-46" für Schuhe
    color?: string[];
    material?: string;
    weight?: number; // in kg
  };
}

export interface Inventory {
  id: string;
  companyId: string;
  productId: string;
  quantity: number;
  purchasePrice: number; // Tatsächlicher Einkaufspreis
  location: string; // Lagerplatz
  reservedQuantity: number; // Für offene Bestellungen reserviert
  lastRestocked: Date;
  expiryDate?: Date; // Falls relevant
}

export interface Supplier {
  id: string;
  lobbyId: string;
  name: string;
  legalForm: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  contactPerson: string;
  email: string;
  phone: string;
  paymentTerms: {
    daysNet: number; // Zahlungsziel netto
    discountPercent: number; // Skonto in %
    daysDiscount: number; // Zahlungsziel für Skonto
  };
  deliveryTerms: {
    minOrderValue: number;
    deliveryDays: number; // Lieferzeit in Tagen
    shippingCost: number; // Versandkosten
    freeShippingFrom: number; // Ab diesem Bestellwert versandkostenfrei
  };
  reliability: number; // 0-100, beeinflusst Liefertreue
  productCatalog: string[]; // Product IDs
}

export interface Customer {
  id: string;
  lobbyId: string;
  type: 'company' | 'npc'; // company = andere Unternehmen im Spiel, npc = KI-Kunden
  companyId?: string; // Falls type = 'company'
  name: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  email: string;
  phone: string;
  paymentBehavior: 'excellent' | 'good' | 'fair' | 'poor'; // Zahlungsmoral
  creditLimit: number; // Kreditlimit
  currentBalance: number; // Offener Betrag
  satisfactionScore: number; // 0-100
  lastOrderDate?: Date;
  totalOrders: number;
}

export interface PurchaseOrder {
  id: string;
  lobbyId: string;
  companyId: string; // Käufer
  supplierId: string;
  orderNumber: string;
  orderDate: Date;
  requestedDeliveryDate: Date;
  status: 'draft' | 'sent' | 'confirmed' | 'partially-delivered' | 'delivered' | 'cancelled' | 'disputed';
  items: {
    productId: string;
    quantity: number;
    pricePerUnit: number;
    discount: number; // in %
    total: number;
  }[];
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  paymentTerms: {
    daysNet: number;
    discountPercent: number;
    daysDiscount: number;
  };
  deliveryAddress: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  notes?: string;
  disturbances?: string[]; // IDs von Störungen (z.B. Lieferverzug)
  createdBy: string; // PlayerSession ID
}

export interface SalesOrder {
  id: string;
  lobbyId: string;
  companyId: string; // Verkäufer
  customerId: string;
  orderNumber: string;
  orderDate: Date;
  requestedDeliveryDate: Date;
  status: 'inquiry' | 'offer-sent' | 'confirmed' | 'in-preparation' | 'shipped' | 'delivered' | 'invoiced' | 'paid' | 'cancelled' | 'disputed';
  items: {
    productId: string;
    quantity: number;
    pricePerUnit: number;
    discount: number;
    total: number;
  }[];
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  paymentTerms: {
    daysNet: number;
    discountPercent: number;
    daysDiscount: number;
  };
  deliveryAddress: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  notes?: string;
  disturbances?: string[]; // IDs von Störungen
  createdBy: string; // PlayerSession ID
}

export interface Invoice {
  id: string;
  lobbyId: string;
  companyId: string;
  type: 'purchase' | 'sales'; // Eingangs- oder Ausgangsrechnung
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  orderId: string; // PurchaseOrder oder SalesOrder ID
  supplierId?: string; // Falls purchase
  customerId?: string; // Falls sales
  items: {
    description: string;
    quantity: number;
    pricePerUnit: number;
    discount: number;
    total: number;
  }[];
  subtotal: number;
  taxRate: number; // MwSt in %
  taxAmount: number;
  totalAmount: number;
  paymentTerms: {
    daysNet: number;
    discountPercent: number;
    daysDiscount: number;
  };
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'disputed';
  paidDate?: Date;
  paidAmount?: number;
  discountTaken?: boolean;
  hasErrors?: boolean; // Für Fehlerprüfungs-Aufgaben
  errors?: string[];
}

export interface BookingEntry {
  id: string;
  lobbyId: string;
  companyId: string;
  entryNumber: string;
  entryDate: Date;
  documentNumber: string; // Belegnummer
  documentType: 'invoice' | 'receipt' | 'bank-statement' | 'delivery-note' | 'other';
  description: string;
  debitAccount: string; // Sollkonto
  creditAccount: string; // Habenkonto
  amount: number;
  taxRate?: number;
  taxAmount?: number;
  isCorrect?: boolean; // Für Prüfungsaufgaben
  feedback?: string;
  createdBy: string; // PlayerSession ID
  verifiedBy?: string; // PlayerSession ID (falls geprüft)
  createdAt: Date;
}

export interface ContractDisturbance {
  id: string;
  lobbyId: string;
  type: 'lieferverzug' | 'schlechtleistung' | 'zahlungsverzug' | 'nichtlieferung';
  orderId: string; // PurchaseOrder oder SalesOrder ID
  orderType: 'purchase' | 'sales';
  triggeredBy: 'system' | 'teacher'; // System = zufällig, teacher = manuell ausgelöst
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'active' | 'resolved' | 'escalated';
  requiredActions: string[]; // z.B. "Mahnung schreiben", "Nachlieferung anfordern"
  playerResponse?: {
    sessionId: string;
    actionTaken: string;
    responseDate: Date;
    wasCorrect: boolean;
    xpAwarded?: number;
  };
  createdAt: Date;
  resolvedAt?: Date;
}

export interface Calculation {
  id: string;
  lobbyId: string;
  companyId: string;
  sessionId: string; // Wer hat die Kalkulation erstellt
  type: 'bezugskalkulation' | 'handelskalkulation' | 'deckungsbeitrag' | 'break-even';
  productId?: string;
  mode: 'training' | 'production'; // training = Übungsmodus, production = echte Kalkulation
  input: Record<string, number>; // Eingabewerte
  steps: {
    step: string;
    description: string;
    formula?: string;
    value: number;
    isCorrect?: boolean;
  }[];
  result: number;
  isCorrect: boolean;
  errors?: string[];
  xpAwarded?: number;
  createdAt: Date;
}

export interface MarketEvent {
  id: string;
  lobbyId: string;
  type: 'price-change' | 'demand-spike' | 'demand-drop' | 'new-competitor' | 'supplier-issue' | 'trend' | 'season';
  title: string;
  description: string;
  affectedProducts?: string[]; // Product IDs
  affectedSuppliers?: string[]; // Supplier IDs
  impact: {
    priceChange?: number; // in %
    demandChange?: number; // in %
    deliveryDelays?: number; // in Tagen
  };
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  triggeredBy: 'system' | 'teacher';
  createdAt: Date;
}

export interface ExamMode {
  id: string;
  lobbyId: string;
  sessionId: string;
  type: 'buchungssaetze' | 'kalkulation' | 'mahnung' | 'fehlersuche';
  questions: {
    id: string;
    question: string;
    correctAnswer: any;
    playerAnswer?: any;
    isCorrect?: boolean;
    pointsAwarded?: number;
  }[];
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  xpAwarded: number;
  startedAt: Date;
  completedAt?: Date;
  timeLimit?: number; // in Sekunden
}
