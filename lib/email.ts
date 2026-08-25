import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface OutbidEmailProps {
  toEmail: string
  projectTitle: string
  newLeaderTitle: string
  newLeaderAmount: number
}

const formatARS = (value: number) =>
  new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(value)

export async function sendOutbidNotificationEmail({
  toEmail,
  projectTitle,
  newLeaderTitle,
  newLeaderAmount,
}: OutbidEmailProps) {
  if (!process.env.RESEND_API_KEY) {
    console.log('⚠️ RESEND_API_KEY no configurada, ignorando envío de email.')
    return
  }

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pay-to-rank-beige.vercel.app'

    await resend.emails.send({
      from: 'InmoRank BA <onboarding@resend.dev>',
      to: [toEmail],
      replyTo: 'inmorankba@gmail.com',
      subject: `🚨 Superaron a "${projectTitle}" en InmoRank BA`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #F8F9FA; color: #0F172A;">
          <div style="background-color: #ffffff; padding: 32px; border-radius: 16px; border: 1px solid #E2E8F0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            <div style="margin-bottom: 24px; text-align: center;">
              <span style="font-size: 28px;">🏛️</span>
              <h2 style="font-size: 22px; font-weight: 800; color: #0F172A; margin: 8px 0 0 0;">InmoRank BA</h2>
              <p style="font-size: 13px; color: #64748B; margin: 4px 0 0 0;">Alerta de Posicionamiento Inmobiliario</p>
            </div>

            <p style="font-size: 15px; line-height: 1.6; color: #334155;">
              Hola, el proyecto <strong>"${newLeaderTitle}"</strong> acaba de realizar una inversión de <strong>$${formatARS(newLeaderAmount)} ARS</strong> y ha desplazado a <strong>"${projectTitle}"</strong> en la tabla de clasificación.
            </p>

            <div style="background-color: #FEF3C7; border: 1px solid #FDE68A; border-radius: 12px; padding: 16px; margin: 24px 0; text-align: center;">
              <p style="font-size: 13px; font-weight: 700; color: #92400E; margin: 0;">
                ⚠️ Has perdido la posición principal y los contactos directos de inversores.
              </p>
            </div>

            <div style="text-align: center; margin: 32px 0;">
              <a href="${appUrl}" style="background-color: #0F172A; color: #ffffff; padding: 14px 28px; border-radius: 12px; font-size: 14px; font-weight: 700; text-decoration: none; display: inline-block;">
                Recuperar el Puesto #1 Ahora →
              </a>
            </div>

            <p style="font-size: 12px; color: #94A3B8; text-align: center; margin-top: 32px; border-top: 1px solid #F1F5F9; pt-4;">
              InmoRank BA | Mercado de Atención Inmobiliario en Tiempo Real<br>
              Contacto: inmorankba@gmail.com
            </p>
          </div>
        </div>
      `,
    })

    console.log(`📧 Email de superación enviado con éxito a: ${toEmail}`)
  } catch (error) {
    console.error('Error al enviar email con Resend:', error)
  }
}