import { NextRequest, NextResponse } from 'next/server'
import { mpPreference } from '@/lib/payment'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, tagline, url, category, amount, email, targetEntryId } = body

    if (!title || !url || !amount || Number(amount) < 500) {
      return NextResponse.json(
        { error: 'El monto mínimo de inversión es $500 ARS y todos los campos son obligatorios.' },
        { status: 400 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pay-to-rank-beige.vercel.app'

    const preference = await mpPreference.create({
      body: {
        items: [
          {
            id: 'inmorank-bid',
            title: `Posicionamiento en InmoRank BA: ${title}`,
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
    console.error('Error al generar Checkout en InmoRank BA:', error)
    return NextResponse.json(
      { error: error.message || 'Error al conectar con Mercado Pago' },
      { status: 500 }
    )
  }
}