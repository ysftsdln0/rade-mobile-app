import { PrismaClient } from '@prisma/client';

// Export Prisma Client singleton
const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

// Export a dummy seed function for backwards compatibility
export function seed() {
  console.log('Using Prisma - run "npm run db:seed" to seed the database');
}
