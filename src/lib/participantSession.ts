import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const PARTICIPANT_COOKIE = "ecosim_participant_token";

export async function getParticipantFromSession() {
  const token = cookies().get(PARTICIPANT_COOKIE)?.value;
  if (!token) return null;

  return prisma.participant.findUnique({
    where: { sessionToken: token },
    include: { company: true },
  });
}
