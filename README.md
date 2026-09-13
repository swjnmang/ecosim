# EcoSim – Übungsunternehmen-Simulation 🚲

Multiplayer-Simulation eines Großhandels für Fahrrad- und E-Bike-Zubehör, für
den Übungsunternehmen-Unterricht (Wirtschaftsschule Bayern). Schüler:innen
bearbeiten realitätsnahe Geschäftsvorfälle über einen Posteingang-Workflow:
Einkauf, Verkauf, Kalkulation, Lagerhaltung, Buchungssätze.

Das vollständige Konzept (Rollenmodell, DSGVO-Datenfluss, Datenmodell,
UI-Konzept) steht in [KONZEPT.md](./KONZEPT.md). Der Code-Stand vor diesem
Neuaufbau ist im Branch [`archive/v1`](https://github.com/swjnmang/ecosim/tree/archive/v1)
gesichert.

## 🛠️ Tech-Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Supabase (Postgres, Auth, Realtime), Prisma als ORM
- **Hosting:** Vercel

## 🚀 Quick Start

```bash
npm install
cp .env.local.example .env.local   # Werte aus deinem Supabase-Projekt eintragen
npm run prisma:migrate
npm run db:seed
npm run dev
```

App läuft unter: http://localhost:3000

Ausführliche Einrichtung (Supabase-Projekt, EU-Region, Env-Variablen,
Vercel-Deployment): siehe [SETUP.md](./SETUP.md).

## 📚 Dokumentation

- [KONZEPT.md](./KONZEPT.md) – Rollenmodell, DSGVO-Datenfluss, Datenmodell, UI-Konzept
- [SETUP.md](./SETUP.md) – Supabase & Vercel Setup-Anleitung
