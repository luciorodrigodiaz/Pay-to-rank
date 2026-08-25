import { NextRequest, NextResponse } from 'next/server'
import { mpPreference } from '@/lib/payment'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, tagline, url, category, amount, email, targetEntryId } = body

    // 1. Validaciones estrictas
    if (!title || !url || !amount || Number(amount) < 1000) {
      return NextResponse.json(
        { error: 'El monto mínimo de inversión es $1.000 ARS y todos los campos son obligatorios.' },
        { status: 400 }
      )
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return NextResponse.json(
        { error: 'La URL debe comenzar con http:// o https://' },
        { status: 400 }
      )
    }

    // Dominio base de producción
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pay-to-rank-beige.vercel.app'

    // 2. Crear la Preferencia real en Mercado Pago
    const preference = await mpPreference.create({
      body: {
        items: [
          {
            id: 'top-inmobiliario-bid',
            title: `Posicionamiento en Top Inmobiliario: ${title}`,
            description: tagline || 'Visibilidad en el ranking inmobiliario de Buenos Aires',
            quantity: 1,
            unit_price: Number(amount),
            currency_id: 'ARS',
          },
        ],
        payer: {
          email: email,
        },
        back_urls: {
          success: `${baseUrl}/?payment_success=true`,
          failure: `${baseUrl}/?payment_cancelled=true`,
          pending: `${baseUrl}/?payment_pending=true`,
        },
        auto_return: 'approved',
        metadata: {
          title,
          tagline,
          url,
          category,
          amount: Number(amount),
          email,
          target_entry_id: targetEntryId || '',
        },
        notification_url: `${baseUrl}/api/webhooks`,
      },
    })

    const checkoutUrl = preference.init_point || preference.sandbox_init_point
    return NextResponse.json({ url: checkoutUrl })
  } catch (error: any) {
    console.error('Error al generar Checkout de Mercado Pago:', error)
    return NextResponse.json(
      { error: error.message || 'Error al conectar con la pasarela de Mercado Pago' },
      { status: 500 }
    )
  }
}