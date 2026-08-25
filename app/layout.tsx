import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'InmoRank BA | Ranking Inmobiliario y de Desarrollos de Buenos Aires',
  description: 'El ranking de visibilidad #1 para inmobiliarias, desarrolladoras y proyectos de pozo en CABA y GBA.',
  openGraph: {
    title: 'InmoRank BA | ¿Quién lidera el mercado inmobiliario de Buenos Aires?',
    description: 'Compite por el primer lugar de visibilidad para captar compradores e inversores inmobiliarios.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-[#F8F9FA] text-slate-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}