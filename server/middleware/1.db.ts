import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

declare module 'h3' {
  interface H3EventContext {
    db: typeof prisma;
  }
}

export default defineEventHandler(async (event) => {
  event.context.db = prisma;
});
