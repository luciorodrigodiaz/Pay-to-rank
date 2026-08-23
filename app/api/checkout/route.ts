import { NextRequest, NextResponse } from 'next/server'
import { mpPreference } from '@/lib/payment'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, tagline, url, category, amount, email, targetEntryId } = body

    if (!title || !url || !amount || Number(amount) < 1) {
      return NextResponse.json(
        { error: 'Monto o campos obligatorios incompletos' },
        { status: 400 }
      )
    }

    const host = request.headers.get('origin') || 'http://localhost:3000'

    // Modo simulador si no hay Access Token configurado aún
    if (!process.env.MP_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN.includes('mock')) {
      return NextResponse.json({
        url: `${host}/?payment_success=true&simulated=true&title=${encodeURIComponent(
          title
        )}&amount=${amount}&url=${encodeURIComponent(url)}&tagline=${encodeURIComponent(
          tagline
        )}&category=${encodeURIComponent(category)}&email=${encodeURIComponent(email)}`,
      })
    }

    // Crear la Preferencia real en Mercado Pago
    const preference = await mpPreference.create({
      body: {
        items: [
          {
            id: 'pay-to-rank-bid',
            title: `Puja por posición: ${title}`,
            description: tagline || 'Visibilidad en Leaderboard',
            quantity: 1,
            unit_price: Number(amount),
            currency_id: 'ARS', // Pesos Argentinos
          },
        ],
        payer: {
          email: email,
        },
        back_urls: {
          success: `${host}/?payment_success=true`,
          failure: `${host}/?payment_cancelled=true`,
          pending: `${host}/?payment_pending=true`,
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
        notification_url: `${host}/api/webhooks`,
      },
    })

    // Retorna la URL de checkout (init_point para producción / sandbox_init_point para pruebas)
    const checkoutUrl = preference.init_point || preference.sandbox_init_point
    return NextResponse.json({ url: checkoutUrl })
  } catch (error: any) {
    console.error('Error al generar Checkout de Mercado Pago:', error)
    return NextResponse.json(
      { error: error.message || 'Error al procesar con Mercado Pago' },
      { status: 500 }
    )
  }
}