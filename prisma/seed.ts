import { prisma } from '../lib/db/prisma'

async function main() {
  await prisma.bid.deleteMany()
  await prisma.entry.deleteMany()

  // 1. Toribio Achaval
  await prisma.entry.create({
    data: {
      title: 'Toribio Achaval Propiedades',
      tagline: 'Comercializacion exclusiva de residencias premium y proyectos de lujo en CABA',
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

  // 2. L.J. Ramos
  await prisma.entry.create({
    data: {
      title: 'L.J. Ramos Brokers Inmobiliarios',
      tagline: 'Mas de 35 anos de liderazgo en propiedades residenciales y comerciales en CABA y GBA',
      url: 'https://www.ljramos.com.ar',
      category: 'Belgrano',
      totalBid: 240000.0,
      clicks: 510,
      bids: {
        create: [{ amount: 240000.0, payerEmail: 'contacto@ljramos.com.ar' }],
      },
    },
  })

  // 3. Lepore
  await prisma.entry.create({
    data: {
      title: 'Lepore Propiedades',
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

  console.log('Seed completado exitosamente en Turso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })