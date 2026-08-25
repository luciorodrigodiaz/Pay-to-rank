import { prisma } from '../lib/db/prisma'

async function main() {
  // Limpiar datos anteriores
  await prisma.bid.deleteMany()
  await prisma.entry.deleteMany()

  // 1. Puesto #1: Toribio Achával (Líder en Lujo)
  await prisma.entry.create({
    data: {
      title: 'Toribio Achával Propiedades',
      tagline: 'Comercialización exclusiva de residencias premium y proyectos de lujo en CABA',
      url: 'https://toribioachaval.com',
      category: 'Recoleta',
      totalBid: 350000.0,
      clicks: 720,
      bids: {
        create: [
          { amount: 150000.0, payerEmail: 'institucional@toribioachaval.com' },
          { amount: 200000.0, payerEmail: 'institucional@toribioachaval.com' },
        ],
      },
    },
  })

  // 2. Puesto #2: L.J. Ramos Brokers
  await prisma.entry.create({
    data: {
      title: 'L.J. Ramos Brokers Inmobiliarios',
      tagline: 'Más de 35 años de liderazgo en propiedades residenciales y comerciales en CABA y GBA',
      url: 'https://www.ljramos.com.ar',
      category: 'Belgrano',
      totalBid: 240000.0,
      clicks: 510,
      bids: {
        create: [{ amount: 240000.0, payerEmail: 'contacto@ljramos.com.ar' }],
      },
    },
  })

  // 3. Puesto #3: Lépore Propiedades
  await prisma.entry.create({
    data: {
      title: 'Lépore Propiedades',
      tagline: 'Especialistas en emprendimientos en pozo y oportunidades residenciales en Caballito y Palermo',
      url: 'https://www.lepore.com.ar',
      category: 'Caballito',
      totalBid: 160000.0,
      clicks: 385,
      bids: {
        create: [{ amount: 160000.0, payerEmail: 'ventas@lepore.com.ar' }],
      },
    },
  })

  console.log('🌱 Base de datos actualizada con inmobiliarias reales de Buenos Aires!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })