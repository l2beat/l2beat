import { OklchColor } from '../store/utils/color'

export const SELECTABLE_COLORS: OklchColor[] = [
  parseOklch('oklch(60.53% 0.1951 14.67)'),
  parseOklch('oklch(72.67% 0.1192 74.48)'),
  parseOklch('oklch(68.97% 0.2072 147)'),
  parseOklch('oklch(68.97% 0.2072 147)'),
  parseOklch('oklch(68.97% 0.2072 147)'),
  parseOklch('oklch(68.97% 0.2072 147)'),
  parseOklch('oklch(68.97% 0.2072 147)'),
]

function parseOklch(input: string): OklchColor {
  const matches = input.matchAll(/\d+(\.\d+)?/g)
  const [l = 0, c = 0, h = 0] = [...matches].map((x) => parseFloat(x[0]))
  return { l: l / 100, c, h }
}

export function getColor(
  id: string,
  n: number,
): { color: string; isDark: boolean } {
  if (n === 0) {
    return getChainColor(id.split(':')[0] ?? '')
  }
  return { color: 'blue', isDark: true }
}

export function getChainColor(chain: string): {
  color: string
  isDark: boolean
} {
  if (chain === 'ethereum') {
    return { color: 'white', isDark: false }
  }

  return { color: 'red', isDark: false }
}
