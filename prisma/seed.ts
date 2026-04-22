import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 seeding database..");

  await prisma.article.deleteMany();
  await prisma.source.deleteMany();

  const sources = [
    {
      name: "anthropic",
      url: "https://www.anthropic.com/news/rss.xml",
      tier: 1,
    },
    {
      name: "openai",
      url: "https://openai.com/blog/rss.xml",
      tier: 1,
    },
    {
      name: "google",
      url: "https://blog.research.google/feeds/posts/default",
      tier: 1,
    },
  ];

  for (const source of sources) {
    await prisma.source.create({
      data: source,
    });
    console.log(`✅ created: $(source.name)`);
  }

  console.log(`🎉 seeding complete!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
