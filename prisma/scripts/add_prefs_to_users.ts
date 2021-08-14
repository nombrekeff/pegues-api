import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

const prisma = new PrismaClient();

async function main() {
  dotenv.config();
  console.log('Adding preferences...');

  const users = await prisma.user.findMany({});
  console.log({ users });

  for (let user of users) {
    await prisma.userPreferences.create({
      data: {
        authorId: user.id,
      },
    });
  }

}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
