# 🏛️ Top Inmobiliario CABA & Buenos Aires

> Plataforma de **Mercado de Atención y Ranking de Visibilidad en Tiempo Real** para inmobiliarias, desarrolladoras y proyectos de pozo en CABA y GBA, inspirada en la mecánica de subastas de atención (*Pay-to-Rank Attention Markets*).

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma)
![Turso](https://img.shields.io/badge/Turso_LibSQL-Cloud-00E599?style=for-the-badge&logo=sqlite)
![Mercado Pago](https://img.shields.io/badge/Mercado_Pago-Checkout_Pro-009EE3?style=for-the-badge&logo=mercadopago)

---

## 🎯 Propuesta de Valor y Modelo de Negocio

A diferencia de los portales inmobiliarios tradicionales con algoritmos cerrados, **Top Inmobiliario** opera con una regla transparente:
1. **Posicionamiento por Inversión:** Quien mayor inversión publicitaria acumula en la plataforma, ostenta el puesto **#1** y captura la atención de compradores e inversores de pozo.
2. **Mecánica de Desbancar (*Outbid*):** Inmobiliarias y desarrolladoras pueden pujar en tiempo real a través de **Mercado Pago** para escalar posiciones.
3. **Métricas y Proxy de Auditoría (`/r/[id]`):** Cada enlace redirige mediante un proxy HTTP 307 que registra e incrementa de forma atómica cada contacto o clic directo entregado.

---

## 🏗️ Arquitectura Técnica

* **React Server Components (RSC):** Renderizado en servidor con carga instantánea y optimización SEO.
* **Base de Datos Serverless Distribuida:** Motor LibSQL en la nube con **Turso** y ORM **Prisma 7** con driver adapters para latencias mínimas.
* **Transacciones Atómicas:** Registro inmutable de pagos (`bids`) y actualización de ranking (`entries`) dentro de transacciones de base de datos (`prisma.$transaction`).
* **Pasarela de Pagos Local:** Integración del SDK oficial v2 de **Mercado Pago** con soporte para Checkout Pro en Pesos Argentinos (ARS).
* **Diseño Editorial Luxury:** Estética en modo claro inspirada en publicaciones de arquitectura de alto nivel con **Playfair Display**, acentos en oro satinado y verde esmeralda.

---

## 📂 Estructura de Carpetas

```text
├── app/
│   ├── api/
│   │   ├── checkout/route.ts      # Generador de preferencias de Mercado Pago
│   │   └── webhooks/route.ts      # Receptor y validador de pagos
│   ├── r/
│   │   └── [id]/route.ts          # Endpoint proxy de tracking y redirección 307
│   ├── layout.tsx                # Fuentes Serif / Sans y metadatos OpenGraph
│   └── page.tsx                  # Server Component principal (Leaderboard & Métricas)
├── components/
│   ├── HeaderStats.tsx           # Métricas agregadas, badge online y reglas
│   ├── LeaderboardTable.tsx      # Tabla interactiva con filtros por barrio/zona
│   ├── LeaderboardContainer.tsx  # Wrapper con manejo de estado
│   ├── BidModal.tsx              # Formulario interactivo de puja inmobiliaria
│   ├── LiveFeed.tsx              # Historial reciente de transacciones
│   └── ConfettiEffect.tsx        # Animación visual de éxito
├── lib/
│   ├── db/prisma.ts              # Singleton de Prisma 7 con LibSQL Adapter
│   └── payment.ts                # Inicialización del SDK de Mercado Pago
└── prisma/
    ├── schema.prisma             # Modelos relacionales (Entry, Bid)
    ├── sync-turso.ts             # Sincronizador de base de datos cloud
    └── seed.ts                   # Datos iniciales del sector inmobiliario