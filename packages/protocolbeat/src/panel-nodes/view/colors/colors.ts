import type { ApiAddressType } from '../../../api/types'
import colors from '../../../colors.json'
import { oklchColorToCSS } from './oklch'

export const SELECTABLE_COLORS: { color: string; isDark: boolean }[] = [
  { color: colors.aux.red, isDark: false },
  { color: colors.aux.orange, isDark: false },
  { color: colors.aux.yellow, isDark: false },
  { color: colors.aux.teal, isDark: false },
  { color: colors.aux.green, isDark: false },

  { color: colors.aux.cyan, isDark: false },
  { color: colors.aux.blue, isDark: false },
  { color: colors.aux.purple, isDark: false },
  { color: colors.aux.pink, isDark: false },
  { color: colors.white, isDark: false },
  { color: colors.black, isDark: true },
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
      return { color: colors.aux.red, isDark: false }
    }
    return getChainColor(id.split(':')[0] ?? '')
  }
  return SELECTABLE_COLORS[color - 1] ?? { color: 'white', isDark: false }
}

function getChainColor(chain: string): {
  color: string
  isDark: boolean
} {
  if (chain === 'eth' || chain === 'ethereum') {
    return { color: colors.aux.blue, isDark: false }
  }
  if (chain === 'oeth' || chain === 'optimism') {
    return { color: colors.aux.orange, isDark: false }
  }
  if (chain === 'arb1' || chain === 'arbitrum') {
    return { color: colors.aux.teal, isDark: false }
  }
  if (chain === 'base') {
    return { color: colors.aux.pink, isDark: false }
  }
  if (chain === 'bnb' || chain === 'bsc') {
    return { color: colors.aux.yellow, isDark: false }
  }
  if (chain === 'scr' || chain === 'scroll') {
    return { color: colors.coffee['200'], isDark: false }
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

function stringHash(str: string): number {
  let hash = 0x811c9dc5
  const fnvPrime = 0x01000193

  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = (hash * fnvPrime) >>> 0
  }

  return hash
}
