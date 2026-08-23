import { prisma } from '@/lib/db/prisma'
import { HeaderStats } from '@/components/HeaderStats'
import { LeaderboardContainer } from '@/components/LeaderboardContainer'
import { LiveFeed } from '@/components/LiveFeed'

export const dynamic = 'force-dynamic'

interface SearchParamsProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function HomePage({ searchParams }: SearchParamsProps) {
  const params = await searchParams

  // Lógica de desarrollo: simular pago si viene de la URL de éxito
  if (params.simulated === 'true' && params.title && params.amount) {
    const title = String(params.title)
    const amount = parseFloat(String(params.amount))
    const url = String(params.url || 'https://google.com')
    const tagline = String(params.tagline || 'Nuevo proyecto impulsado')
    const category = String(params.category || 'SaaS / AI')
    const email = String(params.email || 'dev@local.test')

    // Verificar si ya se procesó para no duplicar en refresh
    const existingBid = await prisma.bid.findFirst({
      where: { paymentIntentId: `sim_${title}_${amount}` },
    })

    if (!existingBid) {
      const entry = await prisma.entry.create({
        data: {
          title,
          tagline,
          url,
          category,
          totalBid: amount,
        },
      })

      await prisma.bid.create({
        data: {
          entryId: entry.id,
          amount,
          payerEmail: email,
          paymentIntentId: `sim_${title}_${amount}`,
          status: 'paid',
        },
      })
    }
  }

  // 1. Obtener los proyectos ordenados por totalBid descendente
  const entries = await prisma.entry.findMany({
    where: { status: 'active' },
    orderBy: { totalBid: 'desc' },
  })

  // 2. Obtener las últimas 3 pujas
  const rawRecentBids = await prisma.bid.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: { entry: true },
  })

  const recentBids = rawRecentBids.map((bid) => ({
    id: bid.id,
    amount: bid.amount,
    createdAt: bid.createdAt,
    entryTitle: bid.entry.title,
  }))

  // 3. Métricas
  const totalRaised = entries.reduce((acc, curr) => acc + curr.totalBid, 0)
  const totalClicks = entries.reduce((acc, curr) => acc + curr.clicks, 0)
  const topEntry = entries[0]

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-12 md:py-20 selection:bg-amber-400 selection:text-zinc-950">
      <div className="max-w-5xl mx-auto space-y-10">
        <HeaderStats
          totalRaised={totalRaised}
          topEntryTitle={topEntry?.title || ''}
          topBid={topEntry?.totalBid || 0}
          totalClicks={totalClicks}
        />

        <LeaderboardContainer
          entries={entries}
          topBid={topEntry?.totalBid || 0}
        />

        <LiveFeed recentBids={recentBids} />
      </div>
    </main>
  )
}