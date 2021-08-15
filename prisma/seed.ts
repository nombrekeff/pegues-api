import { PrismaClient, RouteDiscipline } from '@prisma/client';
import * as dotenv from 'dotenv';
import { UserPreferences } from 'src/models/user-preferences.model';

const prisma = new PrismaClient();

async function main() {
  dotenv.config();
  console.log('Seeding...');

  const user1 = await prisma.user.create({
    data: {
      email: 'user@edge.com',
      firstname: 'Manolo',
      lastname: 'Edge',
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // secret42
      roles: ['USER'],
      preferences: {
        create: {
          ...UserPreferences.defaultPrefereneces,
        },
      },
    },
  });
  const user2 = await prisma.user.create({
    data: {
      email: 'admin@edge.com',
      firstname: 'manolo',
      lastname: 'admin',
      roles: ['ADMIN'],
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // secret42
      preferences: {
        create: {
          ...UserPreferences.defaultPrefereneces,
        },
      },
    },
  });

  const zone1 = await prisma.zone.create({
    data: {
      name: 'Zone 1',
      authorId: user1.id,
    },
  });

  const zone2 = await prisma.zone.create({
    data: {
      name: 'Zone 2',
      authorId: user2.id,
    },
  });

  const route1 = await prisma.route.createMany({
    data: [
      {
        name: 'Route 1',
        zoneId: zone1.id,
        authorId: user1.id,
      },
    ],
  });

  const route2 = await prisma.route.createMany({
    data: [
      {
        name: 'Route 2',
        zoneId: zone2.id,
        authorId: user2.id,
      },
    ],
  });

  console.log({ user1, user2 });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
