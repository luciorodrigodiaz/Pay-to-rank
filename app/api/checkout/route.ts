import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/payment'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, tagline, url, category, amount, email, targetEntryId } = body

    // Validación básica de campos
    if (!title || !url || !amount || Number(amount) < 1) {
      return NextResponse.json(
        { error: 'Monto o campos inválidos' },
        { status: 400 }
      )
    }

    const host = request.headers.get('origin') || 'http://localhost:3000'

    // Si no hay clave real configurada aún, devolvemos un simulador para desarrollo
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('mock')) {
      return NextResponse.json({
        url: `${host}/?payment_success=true&simulated=true&title=${encodeURIComponent(
          title
        )}&amount=${amount}&url=${encodeURIComponent(url)}&tagline=${encodeURIComponent(
          tagline
        )}&category=${encodeURIComponent(category)}&email=${encodeURIComponent(email)}`,
      })
    }

    // Crear la sesión real de Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Puja por posición: ${title}`,
              description: tagline || 'Visibilidad en Pay-to-Rank Leaderboard',
            },
            unit_amount: Math.round(Number(amount) * 100), // Stripe maneja centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email,
      success_url: `${host}/?payment_success=true`,
      cancel_url: `${host}/?payment_cancelled=true`,
      metadata: {
        title,
        tagline,
        url,
        category,
        amount: String(amount),
        email,
        targetEntryId: targetEntryId || '',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Error en /api/checkout:', error)
    return NextResponse.json(
      { error: error.message || 'Error al procesar el checkout' },
      { status: 500 }
    )
  }
}