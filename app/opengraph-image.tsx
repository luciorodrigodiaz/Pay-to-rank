import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'InmoRank BA | Ranking Inmobiliario de Buenos Aires'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '60px',
          border: '12px solid #F59E0B',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '10px 24px',
            borderRadius: '9999px',
          }}
        >
          <span style={{ fontSize: '28px' }}>🏛️</span>
          <span style={{ color: '#F59E0B', fontSize: '22px', fontWeight: 800, letterSpacing: '2px' }}>
            INMORANK BA
          </span>
        </div>

        <h1
          style={{
            fontSize: '56px',
            fontWeight: 900,
            color: '#FFFFFF',
            textAlign: 'center',
            maxWidth: '900px',
            lineHeight: 1.15,
            margin: '0 0 20px 0',
          }}
        >
          Las Inmobiliarias y Desarrollos Líderes de Buenos Aires
        </h1>

        <p
          style={{
            fontSize: '24px',
            color: '#94A3B8',
            textAlign: 'center',
            maxWidth: '800px',
            margin: 0,
          }}
        >
          Subasta de atención y visibilidad en tiempo real para el sector inmobiliario en CABA y GBA.
        </p>
      </div>
    ),
    { ...size }
  )
}