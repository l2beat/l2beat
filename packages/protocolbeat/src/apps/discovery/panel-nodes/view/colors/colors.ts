import colors from '../../../../../oklchColors.json'
import { type OklchColor, oklchColorToCSS } from './oklch'

export const SELECTABLE_COLORS: { color: OklchColor; isDark: boolean }[] = [
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
  hueShift,
  entrypointColors,
}: {
  id: string
  color: number
  hueShift: number
  entrypointColors?: readonly number[]
}): { color: string; isDark: boolean } {
  const paletteIndex =
    entrypointColors && entrypointColors.length > 0
      ? entrypointColors[0]
      : color
  const result =
    paletteIndex === 0
      ? getChainColor(id.split(':')[0] ?? '')
      : (SELECTABLE_COLORS[paletteIndex - 1] ?? {
          color: colors.white,
          isDark: false,
        })

  const colorCopy = {
    ...result.color,
    h: (result.color.h + hueShift) % 360,
  }
  return {
    color: oklchColorToCSS(colorCopy),
    isDark: result.isDark,
  }
}

export function getHeaderPaletteColors(node: {
  id: string
  color: number
  hueShift: number
  entrypointColors?: readonly number[]
}): string[] {
  const indices =
    node.entrypointColors && node.entrypointColors.length > 0
      ? node.entrypointColors
      : node.color > 0
        ? [node.color]
        : [0]

  return indices.map((index) =>
    getColor({
      id: node.id,
      color: index,
      hueShift: index > 0 ? 0 : node.hueShift,
    }).color,
  )
}

export function getTitleBackgroundCss(node: {
  id: string
  color: number
  hueShift: number
  entrypointColors?: readonly number[]
  isInitial: boolean
}): string {
  const palette = getHeaderPaletteColors(node)
  if (palette.length > 1) {
    const stops = palette
      .map((cssColor, index) => {
        const start = (index / palette.length) * 100
        const end = ((index + 1) / palette.length) * 100
        return `${cssColor} ${start}%, ${cssColor} ${end}%`
      })
      .join(', ')
    return `linear-gradient(to right, ${stops})`
  }

  const { color, isDark } = getColor(node)
  if (!node.isInitial) {
    return color
  }

  const contrastColorCSS = isDark
    ? `color-mix(in oklch, ${color}, black 15%)`
    : `color-mix(in oklch, ${color}, white 15%)`

  return `repeating-radial-gradient(
    circle,
    ${contrastColorCSS} 0px,
    ${color} 15px
  )`
}

function getChainColor(chain: string): {
  color: OklchColor
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
  if (chain === 'taiko') {
    return { color: colors.aux.cyan, isDark: false }
  }

  return {
    color: {
      l: 0.75,
      c: 0.12,
      h: stringHash(chain) % 360,
    },
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
