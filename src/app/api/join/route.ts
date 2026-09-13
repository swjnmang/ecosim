import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { PARTICIPANT_COOKIE } from "@/lib/participantSession";

const joinSchema = z.object({
  pin: z.string().length(6),
  pseudonym: z.string().trim().min(1).max(40),
  department: z.enum(["EINKAUF", "VERKAUF", "BUCHHALTUNG"]),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = joinSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }
  const { pin, pseudonym, department } = parsed.data;

  const gameSession = await prisma.gameSession.findUnique({
    where: { pin },
    include: { companies: true },
  });

  if (!gameSession || gameSession.status !== "LAUFEND") {
    return NextResponse.json({ error: "Kein laufendes Spiel mit dieser PIN gefunden." }, { status: 404 });
  }

  // TODO: sobald mehrere Firmen pro Spiel unterstützt werden, hier eine
  // Firmenauswahl statt "erste Firma" anbieten.
  const company = gameSession.companies[0];
  if (!company) {
    return NextResponse.json({ error: "Diesem Spiel ist noch kein Unternehmen zugeordnet." }, { status: 409 });
  }

  const participant = await prisma.participant.create({
    data: {
      companyId: company.id,
      pseudonym,
      department,
      sessionToken: crypto.randomUUID(),
    },
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(PARTICIPANT_COOKIE, participant.sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
