import { ApiAddressType } from '../../../api/types'
import { oklchColorToCSS } from './oklch'

export const SELECTABLE_COLORS: { color: string; isDark: boolean }[] = [
  { color: '#930021', isDark: true }, // red
  { color: '#d25b0b', isDark: false }, // orange
  { color: '#f2c20d', isDark: false }, // yellow
  { color: '#35b180', isDark: false }, // mint
  { color: '#459135', isDark: false }, // green

  { color: '#1c92a8', isDark: false }, // cyan
  { color: '#032395', isDark: true }, // blue
  { color: '#5e185b', isDark: true }, // purple
  { color: '#e27991', isDark: false }, // pink
  { color: 'white', isDark: false },
  { color: 'black', isDark: true },
]

export function getColor({
  id,
  color,
  addressType,
}: {
  id: string
  color: number
  addressType: ApiAddressType
}): { color: string; isDark: boolean } {
  if (color === 0) {
    if (addressType === 'Unknown') {
      return { color: '#be1d1d', isDark: false } // error red
    }
    return getChainColor(id.split(':')[0] ?? '')
  }
  return SELECTABLE_COLORS[color - 1] ?? { color: 'white', isDark: false }
}

export function getChainColor(chain: string): {
  color: string
  isDark: boolean
} {
  if (chain === 'eth' || chain === 'ethereum') {
    return { color: 'rgb(139 139 232)', isDark: false }
  }
  if (chain === 'oeth' || chain === 'optimism') {
    return { color: 'rgb(161 0 18)', isDark: true }
  }
  if (chain === 'arb1' || chain === 'arbitrum') {
    return { color: 'rgb(44 26 159)', isDark: true }
  }
  if (chain === 'base') {
    return { color: 'rgb(97 19 92)', isDark: true }
  }

  return {
    color: oklchColorToCSS({
      l: 0.75,
      c: 0.12,
      h: stringHash(chain) % 360,
    }),
    isDark: false,
  }
}

export function stringHash(str: string): number {
  let hash = 0x811c9dc5
  const fnvPrime = 0x01000193

  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = (hash * fnvPrime) >>> 0
  }

  return hash
}
