export type FormatMode = 'full' | 'short'

export function formatINR(amount: number, mode: FormatMode = 'full'): string {
  if (mode === 'short') {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`
    }
    return `₹${amount.toFixed(0)}`
  }

  if (amount >= 10000000) {
    const crores = Math.floor(amount / 10000000)
    const remainder = amount % 10000000
    const lakhs = Math.floor(remainder / 100000)
    const rest = Math.floor(remainder % 100000)

    let result = `₹${crores},${String(lakhs).padStart(2, '0')},${String(rest).padStart(
      5,
      '0'
    )}`
    return result
  }

  const lakhs = Math.floor(amount / 100000)
  const rest = Math.floor(amount % 100000)

  if (lakhs > 0) {
    return `₹${lakhs},${String(rest).padStart(5, '0')}`
  }

  return `₹${rest.toLocaleString('en-IN')}`
}

export function parseINRInput(value: string): number {
  const cleaned = value.replace(/₹|,|\s/g, '')
  return parseInt(cleaned, 10) || 0
}
