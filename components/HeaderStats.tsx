'use client'

import { useState, useEffect } from 'react'
import { Trophy, TrendingUp, Users, Building2, MapPin } from 'lucide-react'

interface HeaderStatsProps {
  totalRaised: number
  topEntryTitle: string
  topBid: number
  totalClicks: number
}

const formatARS = (value: number) =>
  new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(value)

export function HeaderStats({
  totalRaised,
  topEntryTitle,
  topBid,
  totalClicks,
}: HeaderStatsProps) {
  const [onlineCount, setOnlineCount] = useState(24)

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1
        return Math.min(Math.max(prev + delta, 16), 38)
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full max-w-5xl mx-auto mb-10 pt-4">
      {/* Badge Superior */}
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
          </span>
          <span className="text-slate-700 font-medium">{onlineCount} inversores y compradores explorando ahora</span>
          <span className="text-slate-300">|</span>
          <span className="text-amber-700 font-semibold flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5" /> Mercado Inmobiliario CABA
          </span>
        </div>

        {/* Título en Serif Refinada */}
        <h1 
          className="text-4xl md:text-6xl font-normal tracking-tight text-slate-900 max-w-3xl mx-auto leading-tight"
          style={{ fontFamily: 'var(--font-playfair), serif' }}
        >
          Las Inmobiliarias y Desarrollos <br />
          <span className="italic font-bold text-slate-950 underline decoration-amber-500/50">
            Líderes de Buenos Aires
          </span>
        </h1>
        
        <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          El ranking de atención para inmobiliarias boutique, franquicias y desarrollos en pozo. 
          Superá al líder actual para capturar a los compradores e inversores más calificados.
        </p>
      </div>

      {/* Tarjetas de Métricas - Modo Claro con Sombras Suaves */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Inversión Publicitaria Total</p>
            <p className="text-2xl font-black text-slate-900">${formatARS(totalRaised)} ARS</p>
          </div>
        </div>

        <div className="bg-white border border-amber-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-100/50 to-transparent rounded-bl-full pointer-events-none" />
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl border border-amber-200/80">
            <Trophy className="w-6 h-6" />
          </div>
          <div className="truncate">
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Desarrollo / Inmobiliaria #1</p>
            <p className="text-lg font-bold text-slate-900 truncate">{topEntryTitle || 'Vacante'}</p>
            <p className="text-xs font-bold text-amber-700">${formatARS(topBid)} ARS</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="p-3 bg-slate-100 text-slate-800 rounded-xl border border-slate-200">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Inversores Conectados</p>
            <p className="text-2xl font-black text-slate-900">{formatARS(totalClicks)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}