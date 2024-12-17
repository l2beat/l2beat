import { formatUnits } from 'viem'
import { Parts } from './Parts'

export interface SimpleValueProps {
  type: string
  value: string | bigint | boolean
  transform?: string
}

export function SimpleValue({ type, value, transform }: SimpleValueProps) {
  if (typeof value === 'boolean') {
    return <div className="font-mono">{value.toString()}</div>
  }
  if (type === 'string') {
    return (
      <div className="w-full break-words">
        <span className="select-none text-zinc-600">{'\u201C'}</span>
        <span className="font-serif text-lg">{value.toString()}</span>
        <span className="select-none text-zinc-600">{'\u201D'}</span>
      </div>
    )
  }
  if (type === 'bytes' && typeof value === 'string') {
    if (value.length === 2) {
      return <div className="font-mono text-zinc-600">[empty]</div>
    }
    const data = toTxData(value)
    return (
      <div className="font-mono">
        {data && <div>{data.selector}</div>}
        <Parts value={data?.bytes ?? value.slice(2)} />
      </div>
    )
  }
  if (typeof value === 'bigint') {
    return <div className="font-mono">{formatInt(value, transform)}</div>
  }
  return <div className="font-mono">{value}</div>
}

function toTxData(value: string) {
  if (value.length < 10 || (value.length - 10) % 64 !== 0) {
    return undefined
  }
  return {
    selector: value.slice(2, 10),
    bytes: value.slice(10),
  }
}

function formatInt(value: bigint, transform?: string) {
  if (transform === '18') {
    return formatDecimals(value, 18)
  }
  if (transform === '9') {
    return formatDecimals(value, 9)
  }
  if (transform === '6') {
    return formatDecimals(value, 6)
  }
  if (transform === 'time') {
    return formatTime(value)
  }
  if (transform === 'date') {
    try {
      const iso = new Date(Number(value) * 1000).toISOString()
      return `${iso.slice(0, 10)} ${iso.slice(11, 19)} UTC`
    } catch {
      return 'Invalid date'
    }
  }
  return formatDecimals(value, 0)
}

function formatTime(value: bigint): string {
  if (value < 0) {
    return `- ${formatTime(value)}`
  }
  const parts = []

  const days = value / 86_400n
  value -= days * 86_400n
  if (days > 0) {
    parts.push(`${formatDecimals(days, 0)} days`)
  }

  const hours = value / 3600n
  value -= hours * 3600n
  if (hours > 0) {
    parts.push(`${hours} hours`)
  }

  const minutes = value / 60n
  value -= minutes * 60n
  if (minutes > 0) {
    parts.push(`${minutes} minutes`)
  }

  const seconds = value
  if (seconds > 0) {
    parts.push(`${seconds} seconds`)
  }

  return parts.join(' ') || '0 seconds'
}

function formatDecimals(value: bigint, decimals: number) {
  const formatted = formatUnits(value, decimals)
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
