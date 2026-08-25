import fs from 'fs'

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
  console.log('🌱 Reiniciando ranking con valores accesibles de lanzamiento...')

  const queries = [
    `DELETE FROM "Bid";`,
    `DELETE FROM "Entry";`,
    // Puesto #1 ($3.000 ARS)
    `INSERT INTO "Entry" ("id", "title", "tagline", "url", "category", "totalBid", "clicks", "status") 
     VALUES ('toribio-id', 'Toribio Achával Propiedades', 'Comercialización exclusiva de residencias premium y proyectos de lujo en CABA', 'https://toribioachaval.com', 'Recoleta', 3000.0, 14, 'active');`,
    `INSERT INTO "Bid" ("id", "entryId", "amount", "paymentIntentId", "payerEmail", "status") 
     VALUES ('bid-1', 'toribio-id', 3000.0, 'init_1', 'institucional@toribioachaval.com', 'paid');`,
    
    // Puesto #2 ($2.000 ARS)
    `INSERT INTO "Entry" ("id", "title", "tagline", "url", "category", "totalBid", "clicks", "status") 
     VALUES ('ljramos-id', 'L.J. Ramos Brokers Inmobiliarios', 'Más de 35 años de liderazgo en propiedades residenciales y comerciales en CABA y GBA', 'https://www.ljramos.com.ar', 'Belgrano', 2000.0, 9, 'active');`,
    `INSERT INTO "Bid" ("id", "entryId", "amount", "paymentIntentId", "payerEmail", "status") 
     VALUES ('bid-2', 'ljramos-id', 2000.0, 'init_2', 'contacto@ljramos.com.ar', 'paid');`,
    
    // Puesto #3 ($1.000 ARS)
    `INSERT INTO "Entry" ("id", "title", "tagline", "url", "category", "totalBid", "clicks", "status") 
     VALUES ('lepore-id', 'Lépore Propiedades', 'Especialistas en emprendimientos en pozo y oportunidades residenciales en Caballito y Palermo', 'https://www.lepore.com.ar', 'Caballito', 1000.0, 5, 'active');`,
    `INSERT INTO "Bid" ("id", "entryId", "amount", "paymentIntentId", "payerEmail", "status") 
     VALUES ('bid-3', 'lepore-id', 1000.0, 'init_3', 'ventas@lepore.com.ar', 'paid');`,
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

  console.log('✅ Base de datos reiniciada con piso accesible ($1.000 - $3.000 ARS)!')
}

runSeed().catch((err) => console.error(err))