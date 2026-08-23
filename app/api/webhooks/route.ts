import { NextRequest, NextResponse } from 'next/server'
import { mpPayment } from '@/lib/payment'
import { prisma } from '@/lib/db/prisma'

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const topic = searchParams.get('topic') || searchParams.get('type')
    const id = searchParams.get('id') || searchParams.get('data.id')

    let paymentId = id

    // Si no viene en la query, verificar el body
    if (!paymentId) {
      try {
        const body = await request.json()
        paymentId = body?.data?.id || body?.id
      } catch {
        // Body vacío o no parseable
      }
    }

    if (!paymentId) {
      return NextResponse.json({ message: 'No payment id provided' }, { status: 200 })
    }

    // Consultar el estado del pago directamente en la API de Mercado Pago
    const payment = await mpPayment.get({ id: paymentId })

    if (payment && payment.status === 'approved') {
      const metadata = payment.metadata

      if (metadata) {
        const amount = Number(metadata.amount || payment.transaction_amount)
        const targetEntryId = metadata.target_entry_id

        await prisma.$transaction(async (tx) => {
          let entry

          if (targetEntryId) {
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

          // Registrar el pago evitando duplicados mediante el ID de transacción de MP
          const existingBid = await tx.bid.findUnique({
            where: { paymentIntentId: String(payment.id) },
          })

          if (!existingBid) {
            await tx.bid.create({
              data: {
                entryId: entry.id,
                amount: amount,
                payerEmail: metadata.email || payment.payer?.email,
                paymentIntentId: String(payment.id),
                status: 'paid',
              },
            })
          }
        })

        console.log(`✅ Pago aprobado por Mercado Pago: $${amount} ARS para ${metadata.title}`)
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 })
  } catch (error: any) {
    console.error('Error procesando webhook de Mercado Pago:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}