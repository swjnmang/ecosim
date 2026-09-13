import { createBrowserClient } from "@supabase/ssr";

// Für Admin- und Lehrkraft-Login (echte Accounts, Email+Passwort).
// Teilnehmer:innen nutzen bewusst kein Supabase Auth, siehe KONZEPT.md
// Abschnitt 2/3 - PIN-Beitritt mit eigenem Session-Token stattdessen.
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
