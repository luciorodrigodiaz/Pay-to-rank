import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // 1. Buscar la entrada y sumar 1 clic de forma atómica
    const entry = await prisma.entry.update({
      where: { id },
      data: {
        clicks: {
          increment: 1,
        },
      },
      select: {
        url: true,
      },
    })

    if (!entry || !entry.url) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // 2. Redirigir al usuario a la URL real del proyecto
    return NextResponse.redirect(new URL(entry.url))
  } catch (error) {
    console.error('Error al procesar redirección:', error)
    // Si el ID no existe o falla, volvemos a la home
    return NextResponse.redirect(new URL('/', request.url))
  }
}