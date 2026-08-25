import { NextRequest, NextResponse } from 'next/server'
import { mpPayment } from '@/lib/payment'
import { prisma } from '@/lib/db/prisma'
import { sendOutbidNotificationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const topic = searchParams.get('topic') || searchParams.get('type')
    const id = searchParams.get('id') || searchParams.get('data.id')

    let paymentId = id

    if (!paymentId) {
      try {
        const body = await request.json()
        paymentId = body?.data?.id || body?.id
      } catch {}
    }

    if (!paymentId) {
      return NextResponse.json({ message: 'No payment id provided' }, { status: 200 })
    }

    const payment = await mpPayment.get({ id: paymentId })

    if (payment && payment.status === 'approved') {
      const metadata = payment.metadata

      if (metadata) {
        const amount = Number(metadata.amount || payment.transaction_amount)
        const targetEntryId = metadata.target_entry_id

        // 1. Identificar al líder anterior antes de actualizar
        const previousLeader = await prisma.entry.findFirst({
          orderBy: { totalBid: 'desc' },
          include: { bids: { take: 1, orderBy: { createdAt: 'desc' } } },
        })

        // 2. Ejecutar la transacción de actualización
        await prisma.$transaction(async (tx: any) => {
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

        // 3. Disparar email al líder superado si perdió el #1
        if (
          previousLeader &&
          previousLeader.title !== metadata.title &&
          previousLeader.bids[0]?.payerEmail
        ) {
          await sendOutbidNotificationEmail({
            toEmail: previousLeader.bids[0].payerEmail,
            projectTitle: previousLeader.title,
            newLeaderTitle: metadata.title,
            newLeaderAmount: amount,
          })
        }

        console.log(`✅ Pago aprobado por Mercado Pago: $${amount} ARS para ${metadata.title}`)
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 })
  } catch (error: any) {
    console.error('Error procesando webhook de Mercado Pago:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}