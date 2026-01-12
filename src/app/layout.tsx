import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EcoSim – Wirtschaftssimulation',
  description: 'Lernspiel zur Simulation des Arbeitsalltags eines Kaufmanns für Büromanagement',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="antialiased">{children}</body>
    </html>
  );
}
