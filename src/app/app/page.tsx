import { redirect } from "next/navigation";
import { Desktop } from "@/components/desktop/Desktop";
import { getParticipantFromSession } from "@/lib/participantSession";

export default async function AppDesktopPage() {
  const participant = await getParticipantFromSession();

  if (!participant) {
    redirect("/play");
  }

  return (
    <main className="pt-8">
      <Desktop
        companyName={participant.company.name}
        balance={Number(participant.company.balance)}
        department={participant.department}
        pseudonym={participant.pseudonym}
        inboxCount={0}
      />
    </main>
  );
}
