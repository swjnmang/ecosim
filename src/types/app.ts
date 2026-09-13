export type Department = "EINKAUF" | "VERKAUF" | "BUCHHALTUNG";

export type AppGroup = "BASIS" | "EINKAUF" | "VERKAUF" | "LAGER" | "BUCHHALTUNG";

export interface AppDefinition {
  key: string;
  label: string;
  iconName: string;
  group: AppGroup;
  href: string;
  // Basis-Apps haben kein ownedBy -> für alle Abteilungen voll nutzbar.
  // Alle anderen Apps sind für die passende(n) Abteilung(en) voll nutzbar,
  // für alle übrigen Teilnehmer:innen nur als Nur-Lese-Ansicht sichtbar.
  ownedBy?: Department[];
}

export const APP_CATALOG: AppDefinition[] = [
  { key: "posteingang", label: "Posteingang", iconName: "mail", group: "BASIS", href: "/app/posteingang" },
  { key: "unternehmen", label: "Mein Unternehmen", iconName: "building", group: "BASIS", href: "/app/unternehmen" },
  { key: "auftragsstatus", label: "Auftragsstatus", iconName: "list-search", group: "BASIS", href: "/app/auftragsstatus" },
  { key: "feierabend", label: "Feierabend", iconName: "door-exit", group: "BASIS", href: "/app/feierabend" },

  { key: "bestellungen", label: "Bestellungen", iconName: "shopping-cart", group: "EINKAUF", href: "/app/bestellungen", ownedBy: ["EINKAUF"] },
  { key: "warenannahme", label: "Warenannahme", iconName: "package", group: "EINKAUF", href: "/app/warenannahme", ownedBy: ["EINKAUF"] },
  { key: "lieferanten", label: "Lieferanten", iconName: "truck", group: "EINKAUF", href: "/app/lieferanten", ownedBy: ["EINKAUF"] },

  { key: "kundensuche", label: "Kundensuche", iconName: "search", group: "VERKAUF", href: "/app/kundensuche", ownedBy: ["VERKAUF"] },
  { key: "warenversand", label: "Warenversand", iconName: "truck-delivery", group: "VERKAUF", href: "/app/warenversand", ownedBy: ["VERKAUF"] },
  { key: "auftragsbearbeitung", label: "Auftragsbearbeitung", iconName: "clipboard-list", group: "VERKAUF", href: "/app/auftragsbearbeitung", ownedBy: ["VERKAUF"] },

  { key: "lager", label: "Lager", iconName: "building-warehouse", group: "LAGER", href: "/app/lager", ownedBy: ["EINKAUF", "VERKAUF"] },

  { key: "onlinebanking", label: "Onlinebanking", iconName: "building-bank", group: "BUCHHALTUNG", href: "/app/onlinebanking", ownedBy: ["BUCHHALTUNG"] },
  { key: "buchungssaetze", label: "Buchungssätze", iconName: "book", group: "BUCHHALTUNG", href: "/app/buchungssaetze", ownedBy: ["BUCHHALTUNG"] },
  { key: "kalkulation", label: "Kalkulation", iconName: "calculator", group: "BUCHHALTUNG", href: "/app/kalkulation", ownedBy: ["BUCHHALTUNG"] },
];

export const GROUP_LABELS: Record<AppGroup, string> = {
  BASIS: "Für alle",
  EINKAUF: "Einkauf",
  VERKAUF: "Verkauf",
  LAGER: "Lager",
  BUCHHALTUNG: "Buchhaltung",
};

export function isOwnedByDepartment(app: AppDefinition, department: Department): boolean {
  if (!app.ownedBy) return true;
  return app.ownedBy.includes(department);
}
