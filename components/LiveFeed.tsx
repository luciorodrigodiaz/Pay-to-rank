import { History, Zap } from 'lucide-react'

export interface RecentBidItem {
  id: string
  amount: number
  createdAt: Date
  entryTitle: string
}

interface LiveFeedProps {
  recentBids: RecentBidItem[]
}

export function LiveFeed({ recentBids }: LiveFeedProps) {
  return (
    <div className="w-full max-w-5xl mx-auto mt-12 mb-16">
      <div className="flex items-center gap-2 mb-4 text-zinc-400">
        <History className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
          Última Actividad en Vivo
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {recentBids.map((bid) => (
          <div
            key={bid.id}
            className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3.5 flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{bid.entryTitle}</p>
                <p className="text-[11px] text-zinc-500">
                  {new Date(bid.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <span className="text-sm font-bold text-emerald-400 pl-2 shrink-0">
              +${bid.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}