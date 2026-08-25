import fs from 'fs'

// Leer .env manualmente sin dependencias
const envFile = fs.readFileSync('.env', 'utf-8')
const env = Object.fromEntries(
  envFile
    .split('\n')
    .filter((line) => line.includes('='))
    .map((line) => {
      const [k, ...v] = line.split('=')
      return [k.trim(), v.join('=').trim().replace(/(^"|"$)/g, '')]
    })
)

const dbUrl = env.DATABASE_URL.replace('libsql://', 'https://')
const token = env.TURSO_AUTH_TOKEN

async function runSeed() {
  console.log('🚀 Conectando directamente a la API de Turso...')

  const queries = [
    `DELETE FROM "Bid";`,
    `DELETE FROM "Entry";`,
    `INSERT INTO "Entry" ("id", "title", "tagline", "url", "category", "totalBid", "clicks", "status") 
     VALUES ('toribio-id', 'Toribio Achával Propiedades', 'Comercialización exclusiva de residencias premium y proyectos de lujo en CABA', 'https://toribioachaval.com', 'Recoleta', 350000.0, 720, 'active');`,
    `INSERT INTO "Bid" ("id", "entryId", "amount", "paymentIntentId", "payerEmail", "status") 
     VALUES ('bid-1', 'toribio-id', 350000.0, 'init_1', 'institucional@toribioachaval.com', 'paid');`,
    `INSERT INTO "Entry" ("id", "title", "tagline", "url", "category", "totalBid", "clicks", "status") 
     VALUES ('ljramos-id', 'L.J. Ramos Brokers Inmobiliarios', 'Más de 35 años de liderazgo en propiedades residenciales y comerciales en CABA y GBA', 'https://www.ljramos.com.ar', 'Belgrano', 240000.0, 510, 'active');`,
    `INSERT INTO "Bid" ("id", "entryId", "amount", "paymentIntentId", "payerEmail", "status") 
     VALUES ('bid-2', 'ljramos-id', 240000.0, 'init_2', 'contacto@ljramos.com.ar', 'paid');`,
    `INSERT INTO "Entry" ("id", "title", "tagline", "url", "category", "totalBid", "clicks", "status") 
     VALUES ('lepore-id', 'Lépore Propiedades', 'Especialistas en emprendimientos en pozo y oportunidades residenciales en Caballito y Palermo', 'https://www.lepore.com.ar', 'Caballito', 160000.0, 385, 'active');`,
    `INSERT INTO "Bid" ("id", "entryId", "amount", "paymentIntentId", "payerEmail", "status") 
     VALUES ('bid-3', 'lepore-id', 160000.0, 'init_3', 'ventas@lepore.com.ar', 'paid');`,
  ]

  const response = await fetch(`${dbUrl}/v2/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [
        ...queries.map((sql) => ({ type: 'execute', stmt: { sql } })),
        { type: 'close' },
      ],
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Error en Turso: ${errorText}`)
  }

  console.log('✅ Base de datos Turso actualizada exitosamente con las inmobiliarias oficiales!')
}

runSeed().catch((err) => console.error(err))