import { formatUnits } from 'viem'

export function getFormatHint(name: string): string {
  if (/amount/i.test(name) || /value/i.test(name) || name === 'wad') {
    return 'e18'
  }
  if (
    /date/i.test(name) ||
    /time/i.test(name) ||
    /expir/i.test(name) ||
    /since/i.test(name) ||
    /until/i.test(name)
  ) {
    return 'date'
  }
  if (
    /seconds/i.test(name) ||
    /duration/i.test(name) ||
    /delay/i.test(name) ||
    /wait/i.test(name)
  ) {
    return 'seconds'
  }
  return 'e0'
}

const MAX_UINT = (2n ** 256n - 1n).toString()

export function formatNumber(value: string, transform?: string) {
  if (value === MAX_UINT) {
    return 'Infinity'
  }
  if (transform === 'e18') {
    return formatDecimals(value, 18)
  }
  if (transform === 'e8') {
    return formatDecimals(value, 8)
  }
  if (transform === 'e6') {
    return formatDecimals(value, 6)
  }
  if (transform === 'seconds') {
    return formatDuration(value)
  }
  if (transform === 'date') {
    try {
      const timestamp = Number(value)
      const dateValue = isMilliseconds(timestamp) ? timestamp : timestamp * 1000
      const iso = new Date(dateValue).toISOString()
      return `${iso.slice(0, 10)} ${iso.slice(11, 19)} UTC`
    } catch {
      return 'Invalid date'
    }
  }
  return formatDecimals(value, 0)
}

export function formatDuration(value: string): string {
  let n = BigInt(value)

  if (n < 0) {
    return `- ${formatDuration(value)}`
  }
  const parts = []

  const days = n / 86_400n
  n -= days * 86_400n

  if (days > 0) {
    parts.push(`${formatDecimals(days.toString(), 0)} days`)
  }

  const hours = n / 3600n
  n -= hours * 3600n
  if (hours > 0) {
    parts.push(`${hours} hours`)
  }

  const minutes = n / 60n
  n -= minutes * 60n
  if (minutes > 0) {
    parts.push(`${minutes} minutes`)
  }

  const seconds = n
  if (seconds > 0) {
    parts.push(`${seconds} seconds`)
  }

  return parts.join(' ') || '0 seconds'
}

export function formatDecimals(value: string, decimals: number) {
  if (value === MAX_UINT) {
    return 'Infinity'
  }
  const n = BigInt(value)

  const formatted = formatUnits(n, decimals)
  const [int, fraction] = formatted.split('.') as [string, string | undefined]
  const negative = int.startsWith('-')
  const uint = negative ? int.slice(1) : int
  const ending = decimals === 0 ? '' : `.${fraction ?? 0}`
  const thousands = []
  for (let i = 0; i < uint.length / 3; i++) {
    thousands.unshift(
      uint.slice(Math.max(0, uint.length - (i + 1) * 3), uint.length - i * 3),
    )
  }
  return `${negative ? '-' : ''}${thousands.join(',')}${ending}`
}

// ms will remain above until 33658 yr
function isMilliseconds(timestamp: number): boolean {
  return timestamp > 1e12
}
