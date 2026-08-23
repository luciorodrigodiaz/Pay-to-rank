import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pay-to-Rank | Mercado de Atención en Tiempo Real',
  description: 'Paga para estar en el #1. Consigue visibilidad masiva, backlinks calificados y tráfico en tiempo real.',
  openGraph: {
    title: 'Pay-to-Rank | ¿Cuánto pagarías por estar en el puesto #1?',
    description: 'Compite por visibilidad directa en la tabla de posiciones en tiempo real.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-zinc-950 antialiased`}>
        {children}
      </body>
    </html>
  )
}