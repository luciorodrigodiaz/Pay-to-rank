import 'dotenv/config'
import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

async function sync() {
  console.log('🚀 Conectando a Turso en la nube...')

  // 1. Crear tabla Entry
  await client.execute(`
    CREATE TABLE IF NOT EXISTS "Entry" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "title" TEXT NOT NULL,
      "tagline" TEXT NOT NULL,
      "url" TEXT NOT NULL,
      "category" TEXT NOT NULL DEFAULT 'General',
      "totalBid" REAL NOT NULL DEFAULT 0.0,
      "clicks" INTEGER NOT NULL DEFAULT 0,
      "status" TEXT NOT NULL DEFAULT 'active',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `)

  // 2. Crear tabla Bid
  await client.execute(`
    CREATE TABLE IF NOT EXISTS "Bid" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "entryId" TEXT NOT NULL,
      "amount" REAL NOT NULL,
      "paymentIntentId" TEXT UNIQUE,
      "payerEmail" TEXT,
      "status" TEXT NOT NULL DEFAULT 'paid',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Bid_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
  `)

  console.log('✅ Tablas Entry y Bid creadas exitosamente en Turso!')
}

sync()
  .catch((e) => {
    console.error('Error al sincronizar Turso:', e)
    process.exit(1)
  })