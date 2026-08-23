import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/payment'
import { prisma } from '@/lib/db/prisma'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  let event: Stripe.Event

  try {
    if (process.env.STRIPE_WEBHOOK_SECRET && signature) {
      // 1. Verificación de firma criptográfica
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } else {
      event = JSON.parse(body)
    }
  } catch (err: any) {
    console.error(`⚠️ Error al verificar firma del webhook: ${err.message}`)
    return NextResponse.json({ error: 'Webhook signature failed' }, { status: 400 })
  }

  // 2. Procesar el pago completado
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const metadata = session.metadata

    if (metadata) {
      const amount = parseFloat(metadata.amount || '0')
      const targetEntryId = metadata.targetEntryId

      // Transacción atómica: actualizamos o creamos el proyecto y registramos el bid
      await prisma.$transaction(async (tx) => {
        let entry

        if (targetEntryId) {
          // Si el usuario superó un puesto existente, le sumamos el monto acumulado
          entry = await tx.entry.update({
            where: { id: targetEntryId },
            data: {
              totalBid: { increment: amount },
              title: metadata.title,
              tagline: metadata.tagline,
              category: metadata.category,
            },
          })
        } else {
          // Si es un proyecto nuevo, creamos la entrada
          entry = await tx.entry.create({
            data: {
              title: metadata.title,
              tagline: metadata.tagline,
              url: metadata.url,
              category: metadata.category,
              totalBid: amount,
            },
          })
        }

        // Guardamos el recibo histórico en la tabla de Bids
        await tx.bid.create({
          data: {
            entryId: entry.id,
            amount: amount,
            payerEmail: metadata.email || session.customer_details?.email,
            paymentIntentId: (session.payment_intent as string) || session.id,
            status: 'paid',
          },
        })
      })

      console.log(`✅ Pago procesado exitosamente: $${amount} para ${metadata.title}`)
    }
  }

  return NextResponse.json({ received: true })
}