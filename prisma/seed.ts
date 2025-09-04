import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
const prisma = new PrismaClient();

async function main() {
  // Clear dev (careful : destructive)
  await prisma.vote.deleteMany();
  await prisma.token.deleteMany();
  await prisma.resolution.deleteMany();
  await prisma.owner.deleteMany();

  const total = 1000;
  const base = Math.floor(total / 35);
  let remainder = total - base * 35;

  for (let i = 1; i <= 35; i++) {
    const tantiemes = base + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder--;

    const owner = await prisma.owner.create({
      data: {
        name: `Copropriétaire ${i}`,
        email: `copro${i}@example.com`,
        tantiemes
      }
    });

    await prisma.token.create({
      data: {
        token: uuidv4(),
        ownerId: owner.id
      }
    });
  }

  await prisma.resolution.createMany({
    data: [
      { title: "Syndic privé Habitat77", description: "Voir devis coût global env. 5000 euros par an" },
      { title: "Syndic privé Cabinet Fay", description: "Voir devis coût global env. 5000 euros par an" },
      { title: "Syndic coopératif avec intégrations des membres au conseil syndical", description: "Les quatres membres du syndic doivent faire partie du conseil syndical si le choix de syndic coopératif est choisi" },
      { title: "Arrêt des procédures judiciaires", description: "Ces poursuites judiciaires concernent les refus de paiement de charges de la part de M. Favereaux" },
    ]
  });

  console.log("Seed terminé !");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
