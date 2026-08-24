import { prisma } from '../lib/db/prisma'

async function main() {
  await prisma.bid.deleteMany()
  await prisma.entry.deleteMany()

  // 1. Puesto #1: Desarrollo de Lujo en Puerto Madero
  await prisma.entry.create({
    data: {
      title: 'Madero Harbour Residences',
      tagline: 'Departamentos premium de 2 a 5 ambientes con vista al río y amenities de hotel',
      url: 'https://ejemplo.com/madero-harbour',
      category: 'Puerto Madero',
      totalBid: 450000.0,
      clicks: 840,
      bids: {
        create: [
          { amount: 200000.0, payerEmail: 'ventas@maderoharbour.com' },
          { amount: 250000.0, payerEmail: 'ventas@maderoharbour.com' },
        ],
      },
    },
  })

  // 2. Puesto #2: Inmobiliaria Top en Palermo & Belgrano
  await prisma.entry.create({
    data: {
      title: 'Achával & Asociados Propiedades',
      tagline: 'Líderes en tasaciones y comercialización de propiedades exclusivas en Palermo Chico',
      url: 'https://ejemplo.com/achaval',
      category: 'Palermo',
      totalBid: 280000.0,
      clicks: 530,
      bids: {
        create: [{ amount: 280000.0, payerEmail: 'contacto@achavalprop.com' }],
      },
    },
  })

  // 3. Puesto #3: Preventa de Pozo en Belgrano
  await prisma.entry.create({
    data: {
      title: 'Torre Belgrano Grand Studio',
      tagline: 'Emprendimiento en pozo ideal renta temporaria. Financiación en 36 cuotas en pesos',
      url: 'https://ejemplo.com/belgranogrand',
      category: 'Belgrano',
      totalBid: 190000.0,
      clicks: 310,
      bids: {
        create: [{ amount: 190000.0, payerEmail: 'desarrollos@belgranogrand.com' }],
      },
    },
  })

  // 4. Puesto #4: Zona Norte / Nordelta
  await prisma.entry.create({
    data: {
      title: 'Nordelta Waterfront Mansions',
      tagline: 'Casas sobre la laguna con amarra propia en los barrios más exclusivos de Tigre',
      url: 'https://ejemplo.com/nordelta-waterfront',
      category: 'Zona Norte GBA',
      totalBid: 120000.0,
      clicks: 215,
      bids: {
        create: [{ amount: 120000.0, payerEmail: 'nordelta@premiumrealty.com' }],
      },
    },
  })

  console.log('🌱 Seed inmobiliario completado exitosamente!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })