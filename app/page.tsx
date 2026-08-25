import { prisma } from '@/lib/db/prisma'
import { HeaderStats } from '@/components/HeaderStats'
import { LeaderboardContainer } from '@/components/LeaderboardContainer'
import { LiveFeed } from '@/components/LiveFeed'
import { ConfettiEffect } from '@/components/ConfettiEffect'
import { Building2, ShieldCheck, Mail } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface SearchParamsProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function HomePage({ searchParams }: SearchParamsProps) {
  const params = await searchParams
  const isSuccess = params.payment_success === 'true'

  // Consultar registros directamente de Turso
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
    entryTitle: bid.entry?.title || 'Proyecto Inmobiliario',
  }))

  const totalRaised = entries.reduce((acc: number, curr: any) => acc + curr.totalBid, 0)
  const totalClicks = entries.reduce((acc: number, curr: any) => acc + curr.clicks, 0)
  const topEntry = entries[0]

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-slate-900 px-4 py-12 md:py-20 selection:bg-amber-100 selection:text-amber-900 flex flex-col justify-between">
      <ConfettiEffect trigger={isSuccess} />
      
      <div className="max-w-5xl mx-auto space-y-10 w-full">
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

      {/* Footer Institucional InmoRank BA */}
      <footer className="w-full max-w-5xl mx-auto mt-20 pt-8 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-700" />
          <span className="font-bold text-slate-800">InmoRank BA</span>
          <span>© {new Date().getFullYear()}</span>
        </div>

        <div className="flex items-center gap-6 text-center sm:text-right">
          <span className="flex items-center gap-1 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Cobros oficiales procesados por Mercado Pago
          </span>
          <a
            href="mailto:inmorankba@gmail.com?subject=Consulta%20Comercial%20-%20InmoRank%20BA"
            className="hover:text-slate-900 transition-colors flex items-center gap-1 font-semibold text-slate-700"
          >
            <Mail className="w-3.5 h-3.5" />
            inmorankba@gmail.com
          </a>
        </div>
      </footer>
    </main>
  )
}