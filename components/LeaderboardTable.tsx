'use client'

import { useState } from 'react'
import { ExternalLink, Trophy, Award, Medal, MapPin, Building2, Flame, ArrowUpRight } from 'lucide-react'

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

const BARRIOS_ZONAS = [
  'Todos',
  'Puerto Madero',
  'Palermo',
  'Belgrano',
  'Recoleta',
  'Caballito',
  'Zona Norte GBA',
  'Preventas de Pozo',
  'Alquileres Temporarios',
]

const formatARS = (value: number) =>
  new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(value)

export function LeaderboardTable({ entries, onOpenBidModal }: LeaderboardTableProps) {
  const [activeCategory, setActiveCategory] = useState('Todos')

  const filteredEntries = activeCategory === 'Todos'
    ? entries
    : entries.filter((e) => e.category.toLowerCase() === activeCategory.toLowerCase())

  const topLeaderBid = entries[0]?.totalBid || 0

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white font-black text-sm shadow-md shadow-amber-500/20 border border-amber-300">
            <Trophy className="w-4 h-4" />
          </div>
        )
      case 1:
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300">
            <Award className="w-4 h-4" />
          </div>
        )
      case 2:
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold text-xs border border-amber-200">
            <Medal className="w-4 h-4" />
          </div>
        )
      default:
        return (
          <span className="text-slate-400 font-mono font-bold text-sm pl-2">
            #{index + 1}
          </span>
        )
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {/* Cabecera de la tabla */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 
            className="text-2xl font-bold text-slate-900 flex items-center gap-2"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            <span>Tabla de Clasificación Pública</span>
            <span className="text-xs font-sans font-semibold bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full">
              {filteredEntries.length} compitiendo
            </span>
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Superá al líder actual para capturar el 100% de la visibilidad principal.
          </p>
        </div>

        <button
          onClick={() => onOpenBidModal()}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
        >
          <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
          Desbancar al #1
        </button>
      </div>

      {/* Selector de Barrios / Zonas */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-1">
        <MapPin className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
        {BARRIOS_ZONAS.map((barrio) => (
          <button
            key={barrio}
            onClick={() => setActiveCategory(barrio)}
            className={`text-xs px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all font-medium ${
              activeCategory === barrio
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {barrio}
          </button>
        ))}
      </div>

      {/* Lista de Posiciones */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100">
          {filteredEntries.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              <Building2 className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
              No hay proyectos en esta zona aún. ¡Sé el primero en posicionarte!
            </div>
          ) : (
            filteredEntries.map((entry, index) => {
              const isFirst = index === 0 && activeCategory === 'Todos'
              return (
                <div
                  key={entry.id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 md:p-6 gap-4 transition-all hover:bg-slate-50/80 ${
                    isFirst ? 'bg-amber-50/30 border-l-4 border-l-amber-500' : ''
                  }`}
                >
                  {/* Info Izquierda */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="shrink-0">{getRankBadge(index)}</div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <a
                          href={`/r/${entry.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-slate-900 hover:text-amber-700 transition-colors flex items-center gap-1 text-base group"
                        >
                          <span className="truncate">{entry.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </a>
                        <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 text-slate-500" />
                          {entry.category}
                        </span>
                        {isFirst && (
                          <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300">
                            👑 Líder de la Subasta
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 text-xs md:text-sm truncate mt-1 max-w-xl">
                        {entry.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Info Derecha */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-4 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <p className="text-base font-black text-slate-900">${formatARS(entry.totalBid)} ARS</p>
                      <p className="text-[11px] font-medium text-slate-500">{formatARS(entry.clicks)} clics directos</p>
                    </div>

                    <button
                      onClick={() => onOpenBidModal(entry)}
                      className="bg-white hover:bg-slate-900 hover:text-white text-slate-800 font-bold px-4 py-2 rounded-xl text-xs border border-slate-300 shadow-sm transition-all hover:scale-105 active:scale-95 whitespace-nowrap flex items-center gap-1"
                    >
                      <span>Superar</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}