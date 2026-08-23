import { prisma } from '@/lib/db/prisma'
import { HeaderStats } from '@/components/HeaderStats'
import { LeaderboardContainer } from '@/components/LeaderboardContainer'
import { LiveFeed } from '@/components/LiveFeed'
import { ConfettiEffect } from '@/components/ConfettiEffect'

export const dynamic = 'force-dynamic'

interface SearchParamsProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function HomePage({ searchParams }: SearchParamsProps) {
  const params = await searchParams
  const isSuccess = params.payment_success === 'true'

  // Procesar simulación en desarrollo
  if (params.simulated === 'true' && params.title && params.amount) {
    const title = String(params.title)
    const amount = parseFloat(String(params.amount))
    const url = String(params.url || 'https://google.com')
    const tagline = String(params.tagline || 'Nuevo proyecto impulsado')
    const category = String(params.category || 'SaaS / AI')
    const email = String(params.email || 'dev@local.test')

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

  // Consultar registros tipados
  const entries: any[] = await prisma.entry.findMany({
    where: { status: 'active' },
    orderBy: { totalBid: 'desc' },
  })

  const rawRecentBids: any[] = await prisma.bid.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: { entry: true },
  })

  const recentBids = rawRecentBids.map((bid: any) => ({
    id: bid.id,
    amount: bid.amount,
    createdAt: bid.createdAt,
    entryTitle: bid.entry?.title || 'Proyecto Anónimo',
  }))

  const totalRaised = entries.reduce((acc: number, curr: any) => acc + curr.totalBid, 0)
  const totalClicks = entries.reduce((acc: number, curr: any) => acc + curr.clicks, 0)
  const topEntry = entries[0]

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-12 md:py-20 selection:bg-amber-400 selection:text-zinc-950">
      <ConfettiEffect trigger={isSuccess} />
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