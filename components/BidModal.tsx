'use client'

import { useState, useEffect } from 'react'
import { X, Flame, Sparkles, ArrowRight } from 'lucide-react'
import { EntryItem } from './LeaderboardTable'

interface BidModalProps {
  isOpen: boolean
  onClose: () => void
  targetEntry?: EntryItem | null
  topBid: number
}

export function BidModal({ isOpen, onClose, targetEntry, topBid }: BidModalProps) {
  const [title, setTitle] = useState('')
  const [tagline, setTagline] = useState('')
  const [url, setUrl] = useState('')
  const [category, setCategory] = useState('SaaS / AI')
  const [amount, setAmount] = useState<number>(0)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  // Calcular el monto sugerido mínimo para desbancar
  useEffect(() => {
    if (targetEntry) {
      setTitle(targetEntry.title)
      setUrl(targetEntry.url)
      setTagline(targetEntry.tagline)
      setCategory(targetEntry.category)
      // Para superar un puesto existente, sugerimos el total del puesto + $5
      setAmount(targetEntry.totalBid + 5)
    } else {
      setTitle('')
      setTagline('')
      setUrl('')
      // Para tomar el #1 global, sugerimos el topBid + $5 (mínimo $10)
      setAmount(Math.max(topBid + 5, 10))
    }
  }, [targetEntry, topBid, isOpen])

  if (!isOpen) return null

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          tagline,
          url,
          category,
          amount,
          email,
          targetEntryId: targetEntry?.id,
        }),
      })

      const data = await res.json()

      if (data.url) {
        // Redirigir a la pantalla de pago de Stripe
        window.location.href = data.url
      } else {
        alert(data.error || 'Error al iniciar checkout')
      }
    } catch (err) {
      console.error(err)
      alert('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
        
        {/* Encabezado del modal */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-950/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">
                {targetEntry ? `Superar a "${targetEntry.title}"` : 'Pujar por una Posición'}
              </h3>
              <p className="text-zinc-400 text-xs">
                {targetEntry 
                  ? `Posición actual: $${targetEntry.totalBid} USD`
                  : `El puesto #1 actual está en $${topBid} USD`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
              Título del Proyecto / Producto *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Mi Startup de IA"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
              Tagline o Descripción Corta *
            </label>
            <input
              type="text"
              required
              maxLength={90}
              placeholder="Ej. La herramienta definitiva para programadores"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                URL de Destino *
              </label>
              <input
                type="url"
                required
                placeholder="https://tudominio.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                Categoría *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400 text-sm"
              >
                <option value="SaaS / AI">SaaS / AI</option>
                <option value="Newsletter">Newsletter</option>
                <option value="Design / Tools">Design / Tools</option>
                <option value="DevTools">DevTools</option>
                <option value="Creator / Portfolio">Creator / Portfolio</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
              Tu Email (para recibir notificaciones si te superan) *
            </label>
            <input
              type="email"
              required
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 text-sm"
            />
          </div>

          {/* Selector de Monto */}
          <div className="pt-2">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Monto de la Puja (USD) *
              </label>
              <span className="text-xs text-zinc-400">Min. sugerido: ${targetEntry ? targetEntry.totalBid + 1 : topBid + 1}</span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">$</span>
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-amber-500/40 rounded-xl pl-8 pr-4 py-3 text-white text-lg font-bold focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Botón de Enviar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black py-3 px-4 rounded-xl transition-all shadow-[0_0_25px_rgba(251,191,36,0.3)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Procesando...' : `Asegurar Puesto por $${amount} USD`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}