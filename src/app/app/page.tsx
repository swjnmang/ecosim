import { Desktop } from "@/components/desktop/Desktop";
import { mockParticipant } from "@/data/mockDesktop";

export default function AppDesktopPage() {
  return (
    <main className="pt-8">
      <Desktop
        companyName={mockParticipant.companyName}
        balance={mockParticipant.balance}
        department={mockParticipant.department}
        pseudonym={mockParticipant.pseudonym}
        inboxCount={mockParticipant.inboxCount}
      />
    </main>
  );
}
