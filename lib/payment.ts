import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'

// Inicializamos el cliente con el Access Token
export const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || 'TEST-mock-token',
  options: { timeout: 5000 },
})

export const mpPreference = new Preference(mpClient)
export const mpPayment = new Payment(mpClient)