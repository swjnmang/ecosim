import { PrismaClient } from "@prisma/client";
import { companyTemplates } from "./seed-data/companyTemplates";
import { products } from "./seed-data/products";
import { suppliers } from "./seed-data/suppliers";
import { customers } from "./seed-data/customers";

const prisma = new PrismaClient();

async function main() {
  for (const template of companyTemplates) {
    await prisma.companyTemplate.upsert({
      where: { name: template.name },
      update: {},
      create: template,
    });
  }

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product,
    });
  }

  for (const supplier of suppliers) {
    await prisma.supplier.upsert({
      where: { name: supplier.name },
      update: {},
      create: supplier,
    });
  }

  for (const customer of customers) {
    await prisma.customer.upsert({
      where: { name: customer.name },
      update: {},
      create: customer,
    });
  }

  console.log(
    `Seed abgeschlossen: ${companyTemplates.length} Firmenvorlagen, ${products.length} Produkte, ${suppliers.length} Lieferanten, ${customers.length} Kunden.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
