# Supabase & Vercel Setup

## 1. Supabase-Projekt erstellen

1. Gehe zu [supabase.com](https://supabase.com), mit GitHub anmelden
2. "New Project" → Name: **ecosim**
3. **Region: Frankfurt (EU)** wählen – Pflicht für DSGVO-Konformität
   (siehe KONZEPT.md Abschnitt 3/6)
4. Datenbank-Passwort setzen und sicher notieren

## 2. Zugangsdaten eintragen

In den Projekteinstellungen (Settings → API bzw. Settings → Database):

```bash
cp .env.local.example .env.local
```

Trage ein:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Settings → API
- `SUPABASE_SERVICE_ROLE_KEY` – Settings → API (niemals clientseitig verwenden!)
- `DATABASE_URL` / `DIRECT_URL` – Settings → Database → Connection string
  (Connection Pooling für `DATABASE_URL`, direkte Verbindung für `DIRECT_URL`)

## 3. Datenbankschema anlegen

> Die Prisma-CLI lädt nur `.env`, nicht `.env.local` (das liest ausschließlich
> Next.js). Lege deshalb zusätzlich eine `.env` mit `DATABASE_URL` und
> `DIRECT_URL` an (gleicher Inhalt wie in `.env.local`, siehe `.gitignore` -
> beide Dateien werden nie committet).

```bash
npm install
npm run prisma:migrate
npm run db:seed
```

Das legt alle Tabellen aus `prisma/schema.prisma` an und befüllt
Firmenvorschläge, Produktkatalog, Lieferanten und Kunden mit den Daten aus
`prisma/seed-data/`.

Für lokale Tests des PIN-Beitritts, bevor die Lehrkraft-Auth-Flows gebaut sind:

```bash
npm run db:seed-dev
```

Legt ein Demo-Spiel mit PIN `123456` und einer zugeordneten Firma an
(`prisma/seed-dev.ts` - nicht für Produktion gedacht).

## 4. Row Level Security (RLS)

Supabase aktiviert RLS standardmäßig für neue Tabellen. Da Teilnehmer:innen
**kein** Supabase Auth nutzen (siehe KONZEPT.md Abschnitt 2/3 – Session-Token
statt Login), läuft der Zugriff für die Spiel-Objekte serverseitig über
Next.js Route Handler mit dem Service-Role-Key, nicht direkt vom Client aus.
Nur Admin-/Lehrkraft-Tabellen werden über Supabase Auth + RLS-Policies
abgesichert. Details folgen, sobald die Auth-Flows gebaut sind.

## 5. Authentication (Admin/Lehrkraft)

1. Supabase → **Authentication** → **Providers** → Email aktivieren
2. Keine Anonymous-Auth nötig (Teilnehmer:innen laufen über eigenen
   PIN-Beitritt, nicht über Supabase Auth)

## 6. Lokale Entwicklung

```bash
npm run dev
```

App läuft unter: http://localhost:3000

## 7. Vercel Deployment

1. [vercel.com](https://vercel.com) → mit GitHub anmelden → "New Project"
2. Repository **ecosim** importieren, Framework Next.js wird erkannt
3. Alle Variablen aus `.env.local` unter Settings → Environment Variables eintragen
4. Deploy

Jeder Push zu `main` löst automatisch ein Deployment aus.

## 8. Datenlöschung (DSGVO)

Spieldaten sollen 90 Tage nach Spielende automatisch gelöscht werden
(`GameSession.expiresAt`, siehe KONZEPT.md Abschnitt 7). Umsetzung z.B. über
einen Supabase Cron Job oder Vercel Cron, der abgelaufene `GameSession`s
inkl. verknüpfter Companies/Participants/Orders löscht – noch zu bauen.

## Nützliche Links

- [Supabase Dashboard](https://app.supabase.com)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js Docs](https://nextjs.org/docs)
