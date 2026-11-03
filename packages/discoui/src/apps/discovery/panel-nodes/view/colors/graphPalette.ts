import { assert } from '@l2beat/shared-pure'

export type RGBA = [number, number, number, number]

export interface GraphPalette {
  nodeBody: RGBA
  text: RGBA
  footerText: RGBA
  dot: RGBA
  containerBar: RGBA
  gridDot: RGBA
  accent: RGBA
  connection: RGBA
  connectionDimmed: RGBA
  connectionGrayed: RGBA
}

// WebGL cannot read the CSS variables in index.css, so these repeat them.
export const DARK_GRAPH_PALETTE: GraphPalette = {
  nodeBody: rgbaFromHex('#120f0e', 1),
  text: rgbaFromHex('#f0d8bd', 1),
  footerText: rgbaFromHex('#f0d8bd', 0.4),
  dot: rgbaFromHex('#a98763', 1),
  containerBar: rgbaFromHex('#594c43', 1),
  gridDot: rgbaFromHex('#3c332d', 0.6),
  accent: rgbaFromHex('#bad80a', 1),
  connection: rgbaFromHex('#a98763', 0.6),
  connectionDimmed: rgbaFromHex('#a98763', 0.18),
  connectionGrayed: rgbaFromHex('#f0d8bd', 0.1),
}

// Node headers keep their picked color in every theme, so what is drawn on
// them does too.
export const HEADER_TEXT_ON_DARK = rgbaFromHex('#f0d8bd', 1)
export const HEADER_TEXT_ON_LIGHT = rgbaFromHex('#000000', 1)
export const HEADER_UNVERIFIED = rgbaFromHex('#fb4a35', 1)
export const HEADER_INITIAL = rgbaFromHex('#9dde6c', 1)
export const HEADER_TEMPLATE = rgbaFromHex('#fe8019', 1)
export const TEXT_ON_ACCENT = rgbaFromHex('#000000', 1)

export function rgbaFromHex(hex: string, alpha: number): RGBA {
  assert(hex.length === 7, 'Expected #rrggbb')
  assert(hex.startsWith('#'), 'Expected #rrggbb')
  return [
    parseHexByte(hex.slice(1, 3)),
    parseHexByte(hex.slice(3, 5)),
    parseHexByte(hex.slice(5, 7)),
    alpha,
  ]
}

function parseHexByte(text: string): number {
  const value = Number.parseInt(text, 16)
  assert(!Number.isNaN(value), 'Expected a hex byte')
  return value / 255
}
