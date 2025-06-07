// server/prisma/seed.ts
import { Role } from '../src/generated/prisma';
import prisma from '../src/lib/prisma';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log('Start seeding: Creating initial Warden User...');

  const wardenEmail = process.env.DEFAULT_WARDEN_EMAIL;
  const wardenPassword = process.env.DEFAULT_WARDEN_PASSWORD;

  // --- Add validation to ensure they are set ---
  if (!wardenEmail || !wardenPassword) {
    throw new Error('DEFAULT_WARDEN_EMAIL and DEFAULT_WARDEN_PASSWORD must be set in your .env file');
  }

  // Check if the warden user already exists
  const existingWarden = await prisma.user.findUnique({
    where: { email: wardenEmail },
  });

  if (existingWarden) {
    console.log('Warden user already exists. Seeding skipped.');
    return;
  }

  // Hash the password for the new user
  const hashedPassword = await bcrypt.hash(wardenPassword, 10);

  // Create ONLY the User record for the Warden
  const wardenUser = await prisma.user.create({
    data: {
      firstName: 'Ankit',
      lastName: 'Warden',
      email: wardenEmail,
      password: hashedPassword,
      role: Role.WARDEN,
      isActive: true,
    },
  });

  console.log(`✅ Warden user created successfully with ID: ${wardenUser.id}`);
  console.log('-> Next step: Log in as this user and use the API to create their StaffProfile.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });