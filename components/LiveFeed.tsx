import { History, Building2 } from 'lucide-react'

export interface RecentBidItem {
  id: string
  amount: number
  createdAt: Date
  entryTitle: string
}

interface LiveFeedProps {
  recentBids: RecentBidItem[]
}

const formatARS = (value: number) =>
  new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(value)

export function LiveFeed({ recentBids }: LiveFeedProps) {
  return (
    <div className="w-full max-w-5xl mx-auto mt-12 mb-16">
      <div className="flex items-center gap-2 mb-4 text-slate-500">
        <History className="w-4 h-4 text-amber-600" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Últimas Inversiones Publicitarias Registradas
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {recentBids.map((bid) => (
          <div
            key={bid.id}
            className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-slate-100 rounded-xl text-slate-700">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 truncate">{bid.entryTitle}</p>
                <p className="text-[11px] text-slate-500">
                  {new Date(bid.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <span className="text-sm font-black text-emerald-700 pl-2 shrink-0">
              +${formatARS(bid.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}