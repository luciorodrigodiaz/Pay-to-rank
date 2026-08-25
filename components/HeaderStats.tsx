'use client'

import { useState, useEffect } from 'react'
import { Trophy, TrendingUp, Users, Building2, Zap, ArrowRight, ShieldCheck } from 'lucide-react'

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
  const [onlineCount, setOnlineCount] = useState(27)

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1
        return Math.min(Math.max(prev + delta, 18), 45)
      })
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full max-w-5xl mx-auto mb-10 pt-2">
      {/* Ticker de Estado en Vivo */}
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
          </span>
          <span className="text-slate-800 font-bold">{onlineCount} personas mirando ahora</span>
          <span className="text-slate-300">|</span>
          <span className="text-amber-700 font-semibold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-600" /> Subasta de Atención en Vivo
          </span>
        </div>

        {/* Título Estilo Outbid: Directo, Provocador y Elegante */}
        <h1 
          className="text-4xl md:text-6xl font-normal tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight"
          style={{ fontFamily: 'var(--font-playfair), serif' }}
        >
          Sin algoritmos ocultos. <br />
          <span className="italic font-bold text-slate-950 underline decoration-amber-500/60">
            Quien más invierte, lidera el #1.
          </span>
        </h1>
        
        <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          El primer mercado de visibilidad 100% transparente para desarrollos y bienes raíces en Buenos Aires. 
          Tu inversión define tu posición. Todos los clics van directo a tu WhatsApp o sitio web.
        </p>
      </div>

      {/* Las 3 Reglas del Juego (The Outbid Rules) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm text-xs">
        <div className="flex items-center gap-3 p-2">
          <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-xs">
            1
          </div>
          <div>
            <p className="font-bold text-slate-900">Pujá por tu lugar</p>
            <p className="text-slate-500">Superá la inversión del puesto actual vía Mercado Pago.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 border-t md:border-t-0 md:border-l border-slate-100">
          <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center shrink-0 text-xs">
            2
          </div>
          <div>
            <p className="font-bold text-slate-900">Tomá la cima al instante</p>
            <p className="text-slate-500">El ranking se actualiza en tiempo real al confirmarse el pago.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 border-t md:border-t-0 md:border-l border-slate-100">
          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
            3
          </div>
          <div>
            <p className="font-bold text-slate-900">Capturá inversores</p>
            <p className="text-slate-500">Recibí contactos directos auditados sin intermediarios.</p>
          </div>
        </div>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Inversión Total en Subasta</p>
            <p className="text-2xl font-black text-slate-900">${formatARS(totalRaised)} ARS</p>
          </div>
        </div>

        <div className="bg-white border border-amber-200/80 rounded-2xl p-5 shadow-sm flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl border border-amber-200">
            <Trophy className="w-6 h-6" />
          </div>
          <div className="truncate">
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Líder Actual (#1)</p>
            <p className="text-lg font-bold text-slate-900 truncate">{topEntryTitle || 'Vacante'}</p>
            <p className="text-xs font-bold text-amber-700">${formatARS(topBid)} ARS invertidos</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-slate-100 text-slate-800 rounded-xl border border-slate-200">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Contactos Entregados</p>
            <p className="text-2xl font-black text-slate-900">{formatARS(totalClicks)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}