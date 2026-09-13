// Nur für lokale Entwicklung/Tests: legt ein Demo-Spiel mit PIN 123456 an,
// damit der PIN-Beitritt end-to-end getestet werden kann, bevor die
// Admin-/Lehrkraft-Auth-Flows gebaut sind. teacherAuthUserId ist bewusst
// kein echter Supabase-Auth-Account.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const organization = await prisma.organization.upsert({
    where: { id: "dev-org" },
    update: {},
    create: { id: "dev-org", name: "Demo-Schule" },
  });

  const teacher = await prisma.teacherUser.upsert({
    where: { authUserId: "dev-teacher-1" },
    update: {},
    create: {
      authUserId: "dev-teacher-1",
      email: "demo-lehrkraft@example.com",
      organizationId: organization.id,
    },
  });

  const template = await prisma.companyTemplate.findFirstOrThrow({
    where: { name: "Kettenblatt Handelsgesellschaft" },
  });

  const gameSession = await prisma.gameSession.upsert({
    where: { pin: "123456" },
    update: {},
    create: {
      teacherId: teacher.id,
      name: "Demo-Spiel",
      pin: "123456",
      startingCapital: 10000,
      learningAreas: { einkauf: true, verkauf: true },
      status: "LAUFEND",
      startedAt: new Date(),
      companies: {
        create: {
          templateId: template.id,
          name: template.name,
          iconName: template.iconName,
          balance: 10000,
        },
      },
    },
  });

  console.log(`Demo-Spiel bereit: PIN ${gameSession.pin}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
