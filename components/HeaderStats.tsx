import { Trophy, DollarSign, MousePointerClick, Flame } from 'lucide-react'

interface HeaderStatsProps {
  totalRaised: number
  topEntryTitle: string
  topBid: number
  totalClicks: number
}

export function HeaderStats({
  totalRaised,
  topEntryTitle,
  topBid,
  totalClicks,
}: HeaderStatsProps) {
  return (
    <div className="w-full max-w-5xl mx-auto mb-10">
      {/* Título Principal */}
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold uppercase tracking-wider">
          <Flame className="w-4 h-4 animate-pulse" />
          Mercado de Atención en Tiempo Real
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">
          Paga para estar en el <span className="text-amber-400 underline decoration-amber-400/40">#1</span>
        </h1>
        <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto">
          Consigue tráfico calificado, visibilidad masiva y backlinks directos. Supera al líder actual para capturar toda la atención.
        </p>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Total Recaudado</p>
            <p className="text-2xl font-bold text-white">${totalRaised.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/20">
            <Trophy className="w-6 h-6" />
          </div>
          <div className="truncate">
            <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Líder Actual (#1)</p>
            <p className="text-xl font-bold text-white truncate">{topEntryTitle || 'Nadie aún'}</p>
            <p className="text-xs text-amber-400 font-semibold">${topBid} USD</p>
          </div>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20">
            <MousePointerClick className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Clics Entregados</p>
            <p className="text-2xl font-bold text-white">{totalClicks.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}