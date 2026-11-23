export type DonationFrequency = 'once' | 'monthly'

export const donationAmounts = [15, 30, 60, 120] as const

export const treeDonationOptions = [
  { name: 'Birke', price: 25 },
  { name: 'Pappel', price: 30 },
  { name: 'Buche', price: 35 },
] as const

export function formatDonationAmount(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount)
}
