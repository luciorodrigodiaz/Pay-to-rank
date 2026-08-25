'use client'

import { useState, useEffect } from 'react'
import { X, Building2, Sparkles, ArrowRight, MapPin } from 'lucide-react'
import { EntryItem } from './LeaderboardTable'

interface BidModalProps {
  isOpen: boolean
  onClose: () => void
  targetEntry?: EntryItem | null
  topBid: number
}

const BARRIOS_OPTIONS = [
  'Puerto Madero',
  'Palermo',
  'Belgrano',
  'Recoleta',
  'Caballito',
  'Colegiales & Núñez',
  'Zona Norte GBA',
  'Preventas de Pozo',
  'Alquileres Temporarios',
]

const formatARS = (value: number) =>
  new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(value)

export function BidModal({ isOpen, onClose, targetEntry, topBid }: BidModalProps) {
  const [title, setTitle] = useState('')
  const [tagline, setTagline] = useState('')
  const [url, setUrl] = useState('')
  const [category, setCategory] = useState('Palermo')
  const [amount, setAmount] = useState<number>(0)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (targetEntry) {
      setTitle(targetEntry.title)
      setUrl(targetEntry.url)
      setTagline(targetEntry.tagline)
      setCategory(targetEntry.category)
      // Sugerimos superar el puesto por $500 ARS
      setAmount(targetEntry.totalBid + 500)
    } else {
      setTitle('')
      setTagline('')
      setUrl('')
      // Para tomar el #1 global sugerimos topBid + $500 (mínimo $1.000 ARS)
      setAmount(Math.max(topBid + 500, 1000))
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
        window.location.href = data.url
      } else {
        alert(data.error || 'Error al conectar con Mercado Pago')
      }
    } catch (err) {
      console.error(err)
      alert('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
        
        {/* Encabezado */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl border border-amber-200">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 
                className="font-bold text-slate-900 text-lg"
                style={{ fontFamily: 'var(--font-playfair), serif' }}
              >
                {targetEntry ? `Superar a "${targetEntry.title}"` : 'Publicar en el Ranking #1'}
              </h3>
              <p className="text-slate-500 text-xs">
                {targetEntry 
                  ? `Inversión actual del puesto: $${formatARS(targetEntry.totalBid)} ARS`
                  : `El puesto #1 actual está en $${formatARS(topBid)} ARS`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Nombre de la Inmobiliaria o Proyecto *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Lepore Belgrano / Torre Palermo Sky"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Propuesta de Valor / Tagline (Máx 90 caracteres) *
            </label>
            <input
              type="text"
              required
              maxLength={90}
              placeholder="Ej. Preventa en pozo en 36 cuotas fijas en pesos a metros de Av. Santa Fe"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Link Web o WhatsApp *
              </label>
              <input
                type="url"
                required
                placeholder="https://inmobiliaria.com o wa.me/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Barrio / Zona *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white text-sm"
              >
                {BARRIOS_OPTIONS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email de Contacto (para avisarte si alguien te supera) *
            </label>
            <input
              type="email"
              required
              placeholder="ventas@inmobiliaria.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white text-sm"
            />
          </div>

          {/* Monto */}
          <div className="pt-2">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Inversión de la Puja (ARS) *
              </label>
              <span className="text-xs text-slate-500 font-medium">
                Mínimo sugerido: ${formatARS(targetEntry ? targetEntry.totalBid + 1000 : topBid + 1000)}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-lg">$</span>
              <input
              type="number"
              min="500"
              step="500"
              required
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-slate-50 border border-amber-300 rounded-2xl pl-8 pr-4 py-3.5 text-slate-900 text-xl font-black focus:outline-none focus:border-slate-900 focus:bg-white shadow-inner"
            />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
          >
            {loading ? 'Conectando con Mercado Pago...' : `Asegurar Puesto por $${formatARS(amount)} ARS`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}