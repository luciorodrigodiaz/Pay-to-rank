'use client'

import { ExternalLink, Flame, Trophy, Award, Medal } from 'lucide-react'

export interface EntryItem {
  id: string
  title: string
  tagline: string
  url: string
  category: string
  totalBid: number
  clicks: number
}

interface LeaderboardTableProps {
  entries: EntryItem[]
  onOpenBidModal: (entry?: EntryItem) => void
}

export function LeaderboardTable({ entries, onOpenBidModal }: LeaderboardTableProps) {
  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 font-black text-sm shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <Trophy className="w-4 h-4" />
          </div>
        )
      case 1:
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-300/20 text-slate-200 border border-slate-300/40 font-bold text-sm">
            <Award className="w-4 h-4" />
          </div>
        )
      case 2:
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-700/20 text-amber-600 border border-amber-700/40 font-bold text-sm">
            <Medal className="w-4 h-4" />
          </div>
        )
      default:
        return (
          <span className="text-zinc-500 font-mono font-bold text-sm pl-2">
            #{index + 1}
          </span>
        )
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>Ranking de Proyectos</span>
          <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-700">
            {entries.length} activos
          </span>
        </h2>
        <button
          onClick={() => onOpenBidModal()}
          className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold px-4 py-2 rounded-lg text-sm transition-all shadow-[0_0_20px_rgba(251,191,36,0.2)] hover:scale-105 active:scale-95 flex items-center gap-1.5"
        >
          <Flame className="w-4 h-4 fill-zinc-950" />
          Pujar por el #1
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="divide-y divide-zinc-800/80">
          {entries.map((entry, index) => {
            const isFirst = index === 0
            return (
              <div
                key={entry.id}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-5 gap-4 transition-all hover:bg-zinc-800/40 ${
                  isFirst ? 'bg-gradient-to-r from-amber-500/10 via-transparent to-transparent' : ''
                }`}
              >
                {/* Info Izquierda: Posición + Nombre + Tagline */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="shrink-0">{getRankBadge(index)}</div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={`/r/${entry.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-white hover:text-amber-400 transition-colors flex items-center gap-1 text-base group"
                      >
                        <span className="truncate">{entry.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </a>
                      <span className="text-[11px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-700">
                        {entry.category}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-xs md:text-sm truncate mt-0.5 max-w-lg">
                      {entry.tagline}
                    </p>
                  </div>
                </div>

                {/* Info Derecha: Clics + Bid Total + Botón Superar */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-4 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-800">
                  <div className="text-left sm:text-right">
                    <p className="text-sm font-bold text-emerald-400">${entry.totalBid}</p>
                    <p className="text-[11px] text-zinc-500">{entry.clicks} clics</p>
                  </div>

                  <button
                    onClick={() => onOpenBidModal(entry)}
                    className="bg-zinc-800 hover:bg-zinc-700 hover:text-amber-400 text-zinc-300 font-semibold px-3 py-1.5 rounded-lg text-xs border border-zinc-700 transition-all hover:scale-105 active:scale-95"
                  >
                    Superar puesto
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}