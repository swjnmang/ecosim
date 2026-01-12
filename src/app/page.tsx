import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">EcoSim</h1>
        <p className="text-xl text-gray-600 mb-12">
          Wirtschaftssimulation für das Fach Übungsunternehmen
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Schüler */}
          <Link
            href="/join"
            className="p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition border-2 border-blue-500"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              🎮 Beitreten
            </h2>
            <p className="text-gray-600">
              Tritt einer Lobby mit deinem PIN-Code bei und starte dein Abenteuer
            </p>
          </Link>

          {/* Lehrkraft */}
          <Link
            href="/teacher/login"
            className="p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition border-2 border-green-500"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              👨‍🏫 Lehrkraft
            </h2>
            <p className="text-gray-600">
              Melde dich an, um Lobbys zu erstellen und Schüler zu überwachen
            </p>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-white rounded-lg shadow text-left">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            📋 Über EcoSim
          </h3>
          <p className="text-gray-700 mb-3">
            Erlebe den Arbeitsalltag eines Kaufmanns für Büromanagement:
          </p>
          <ul className="text-gray-700 space-y-2">
            <li>✉️ E-Mails lesen und beantworten</li>
            <li>📦 Waren bestellen und verkaufen</li>
            <li>📊 Lagerbestände prüfen und verwalten</li>
            <li>💰 Bezugs- und Verkaufspreise kalkulieren</li>
            <li>📝 Rechnungen buchen und bearbeiten</li>
            <li>⚖️ Buchungssätze nach Kontenrahmen erstellen</li>
          </ul>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>
            Datenschutz: Diese Seite ist DSGVO-konform und nutzt keine
            Tracking-Dienste.
          </p>
        </div>
      </div>
    </main>
  );
}
