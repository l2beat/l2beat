import colors from '../../../../oklchColors.json'
import type { Node } from '../store/State'
import { getColorValue } from './colors/colors'
import { oklchColorToCSS, type OklchColor } from './colors/oklch'

export const NODE_RADIUS = 4
export const NODE_FULL_RADIUS = 16
export const NODE_INITIAL_RING_SIZE = 15

export interface NodeTitlePaint {
  background: string
  baseColor: string
  contrastColor?: string
  isDark: boolean
  ringSize: number
}

export function isFullHeightNode(node: Node): boolean {
  return node.addressType === 'EOA' && node.fields.length === 0
}

export function getNodeRadius(node: Node): number {
  return isFullHeightNode(node) ? NODE_FULL_RADIUS : NODE_RADIUS
}

export function getNodeTitlePaint(node: Node): NodeTitlePaint {
  const { color, isDark } = getColorValue(node)
  const baseColor = oklchColorToCSS(color)

  if (!node.isInitial) {
    return {
      background: baseColor,
      baseColor,
      isDark,
      ringSize: NODE_INITIAL_RING_SIZE,
    }
  }

  const contrastColor = oklchColorToCSS(
    mixOklch(color, isDark ? colors.black : colors.white, 0.15),
  )

  return {
    background: `repeating-radial-gradient(
      circle,
      ${contrastColor} 0px,
      ${baseColor} ${NODE_INITIAL_RING_SIZE}px
    )`,
    baseColor,
    contrastColor,
    isDark,
    ringSize: NODE_INITIAL_RING_SIZE,
  }
}

function mixOklch(a: OklchColor, b: OklchColor, mixAmount: number): OklchColor {
  const weight = Math.max(0, Math.min(1, mixAmount))
  return {
    l: mixValue(a.l, b.l, weight),
    c: mixValue(a.c, b.c, weight),
    h: mixHue(a, b, weight),
  }
}

function mixValue(a: number, b: number, weight: number): number {
  return a * (1 - weight) + b * weight
}

function mixHue(a: OklchColor, b: OklchColor, weight: number): number {
  if (a.c === 0) return b.h
  if (b.c === 0) return a.h

  const delta = ((((b.h - a.h) % 360) + 540) % 360) - 180
  return (a.h + delta * weight + 360) % 360
}
