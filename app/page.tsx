import { prisma } from '@/lib/db/prisma'
import { HeaderStats } from '@/components/HeaderStats'
import { LeaderboardContainer } from '@/components/LeaderboardContainer'
import { LiveFeed } from '@/components/LiveFeed'

// Revalidar los datos cada 10 segundos
export const revalidate = 10

export default async function HomePage() {
  // 1. Obtener los proyectos ordenados por totalBid descendente
  const entries = await prisma.entry.findMany({
    where: { status: 'active' },
    orderBy: { totalBid: 'desc' },
  })

  // 2. Obtener las últimas pujas registradas
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

  // 3. Métricas agregadas
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