// src/lib/pinGenerator.ts
// Generiert eindeutige, gut lesbare PINs für Lobbies

/**
 * Generiert eine zufällige PIN (z.B. "AB12CD")
 * Format: 2 Buchstaben + 2 Zahlen + 2 Buchstaben
 * Vermeidet ähnlich aussehende Zeichen (0/O, 1/I/L)
 */
export function generateLobbyPin(): string {
  const letters = 'ABCDEFGHJKMNPQRSTUVWXYZ'; // Ohne I, L, O (Verwechslungsgefahr)
  const numbers = '23456789'; // Ohne 0, 1 (Verwechslungsgefahr)

  let pin = '';
  
  // 2 Buchstaben
  pin += letters[Math.floor(Math.random() * letters.length)];
  pin += letters[Math.floor(Math.random() * letters.length)];
  
  // 2 Zahlen
  pin += numbers[Math.floor(Math.random() * numbers.length)];
  pin += numbers[Math.floor(Math.random() * numbers.length)];
  
  // 2 Buchstaben
  pin += letters[Math.floor(Math.random() * letters.length)];
  pin += letters[Math.floor(Math.random() * letters.length)];

  return pin;
}

/**
 * Generiert eine kürzere 4-stellige PIN (nur Zahlen)
 */
export function generateShortPin(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * Validiert eine PIN (Format-Check)
 */
export function isValidPin(pin: string): boolean {
  // Erlaubt: 4-6 Zeichen, alphanumerisch
  return /^[A-Z0-9]{4,6}$/i.test(pin);
}

/**
 * Formatiert PIN für Anzeige (mit Bindestrich)
 * z.B. "AB12CD" → "AB-12-CD"
 */
export function formatPin(pin: string): string {
  if (pin.length === 6) {
    return `${pin.substring(0, 2)}-${pin.substring(2, 4)}-${pin.substring(4, 6)}`;
  }
  if (pin.length === 4) {
    return `${pin.substring(0, 2)}-${pin.substring(2, 4)}`;
  }
  return pin;
}
