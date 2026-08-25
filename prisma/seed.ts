import 'dotenv/config'
import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.DATABASE_URL || 'file:./dev.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
})

async function main() {
  console.log('🌱 Conectando y poblando Turso en la nube...')

  // Limpiar tablas previas
  await client.execute(`DELETE FROM "Bid";`)
  await client.execute(`DELETE FROM "Entry";`)

  const id1 = 'toribio-achaval-id'
  const id2 = 'lj-ramos-id'
  const id3 = 'lepore-propiedades-id'

  // 1. Toribio Achával
  await client.execute({
    sql: `INSERT INTO "Entry" ("id", "title", "tagline", "url", "category", "totalBid", "clicks", "status") 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
    args: [
      id1,
      'Toribio Achával Propiedades',
      'Comercialización exclusiva de residencias premium y proyectos de lujo en CABA',
      'https://toribioachaval.com',
      'Recoleta',
      350000.0,
      720,
      'active',
    ],
  })

  await client.execute({
    sql: `INSERT INTO "Bid" ("id", "entryId", "amount", "paymentIntentId", "payerEmail", "status") 
          VALUES (?, ?, ?, ?, ?, ?);`,
    args: ['bid-1', id1, 350000.0, 'init_payment_1', 'institucional@toribioachaval.com', 'paid'],
  })

  // 2. L.J. Ramos
  await client.execute({
    sql: `INSERT INTO "Entry" ("id", "title", "tagline", "url", "category", "totalBid", "clicks", "status") 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
    args: [
      id2,
      'L.J. Ramos Brokers Inmobiliarios',
      'Más de 35 años de liderazgo en propiedades residenciales y comerciales en CABA y GBA',
      'https://www.ljramos.com.ar',
      'Belgrano',
      240000.0,
      510,
      'active',
    ],
  })

  await client.execute({
    sql: `INSERT INTO "Bid" ("id", "entryId", "amount", "paymentIntentId", "payerEmail", "status") 
          VALUES (?, ?, ?, ?, ?, ?);`,
    args: ['bid-2', id2, 240000.0, 'init_payment_2', 'contacto@ljramos.com.ar', 'paid'],
  })

  // 3. Lépore
  await client.execute({
    sql: `INSERT INTO "Entry" ("id", "title", "tagline", "url", "category", "totalBid", "clicks", "status") 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
    args: [
      id3,
      'Lépore Propiedades',
      'Especialistas en emprendimientos en pozo y oportunidades residenciales en Caballito y Palermo',
      'https://www.lepore.com.ar',
      'Caballito',
      160000.0,
      385,
      'active',
    ],
  })

  await client.execute({
    sql: `INSERT INTO "Bid" ("id", "entryId", "amount", "paymentIntentId", "payerEmail", "status") 
          VALUES (?, ?, ?, ?, ?, ?);`,
    args: ['bid-3', id3, 160000.0, 'init_payment_3', 'ventas@lepore.com.ar', 'paid'],
  })

  console.log('✅ Base de datos poblada exitosamente en Turso!')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })