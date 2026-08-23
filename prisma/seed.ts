import { prisma } from '../lib/db/prisma'

async function main() {
  // Limpiar registros previos
  await prisma.bid.deleteMany()
  await prisma.entry.deleteMany()

  // 1. Primer puesto
  await prisma.entry.create({
    data: {
      title: 'DevJobs AI',
      tagline: 'Encuentra trabajo remoto en tech con inteligencia artificial',
      url: 'https://ejemplo.com/devjobs',
      category: 'AI / Tech',
      totalBid: 150.0,
      clicks: 342,
      bids: {
        create: [
          { amount: 50.0, payerEmail: 'founder@devjobs.ai' },
          { amount: 100.0, payerEmail: 'founder@devjobs.ai' },
        ],
      },
    },
  })

  // 2. Segundo puesto
  await prisma.entry.create({
    data: {
      title: 'Indie Builder Newsletter',
      tagline: 'Aprende a crear micro-SaaS rentables cada semana',
      url: 'https://ejemplo.com/newsletter',
      category: 'Newsletter',
      totalBid: 95.0,
      clicks: 210,
      bids: {
        create: [{ amount: 95.0, payerEmail: 'lucas@indiebuilder.com' }],
      },
    },
  })

  // 3. Tercer puesto
  await prisma.entry.create({
    data: {
      title: 'Iconos Pro Studio',
      tagline: 'Más de 5,000 vectores e iconos libres de regalías',
      url: 'https://ejemplo.com/iconos',
      category: 'Design',
      totalBid: 40.0,
      clicks: 89,
      bids: {
        create: [{ amount: 40.0, payerEmail: 'design@iconospro.com' }],
      },
    },
  })

  console.log('🌱 Seed completado exitosamente!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })