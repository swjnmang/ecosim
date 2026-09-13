import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoSim",
  description: "Übungsunternehmen-Simulation für den Handel mit Fahrrad- und E-Bike-Zubehör",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="mx-auto min-h-screen max-w-3xl px-4 py-8">{children}</body>
    </html>
  );
}
