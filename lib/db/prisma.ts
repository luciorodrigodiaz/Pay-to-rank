import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db'
const authToken = process.env.TURSO_AUTH_TOKEN

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const adapter = new PrismaLibSql({
  url: databaseUrl,
  authToken: authToken,
})

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma