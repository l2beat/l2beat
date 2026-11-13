import { formatCurrency } from '@l2beat/shared-pure'

/**
 * Geometry of the name and net-flow lines drawn under each chain bubble.
 * `ChainBubblesLayer` draws with these numbers and `computeGraphLayout`
 * reserves space with them, so the two can't drift apart.
 */
export function getLabelMetrics(isSmallScreen: boolean) {
  return {
    nameFontSize: isSmallScreen ? 13 : 14,
    nameLineHeight: isSmallScreen ? 15 : 16,
    /** From the bubble's bottom edge to the first name baseline */
    nameOffset: 16,
    netFlowFontSize: 12,
    /** From the last name baseline to the net-flow baseline */
    netFlowOffset: 14,
  }
}

export interface ChainLabel {
  nameLines: string[]
  netFlow: string
}

export function getChainLabel(
  name: string,
  netFlow: number,
  isSmallScreen: boolean,
): ChainLabel {
  return {
    nameLines: getChainNameLines(name, isSmallScreen),
    netFlow: formatNetFlow(netFlow),
  }
}

export function formatNetFlow(netFlow: number) {
  return `${netFlow > 0 ? '+' : ''}${formatCurrency(netFlow, 'usd').replace('-', '−')}`
}

const MOBILE_LABEL_MAX_LINE_LENGTH = 13

export function getChainNameLines(
  name: string,
  isSmallScreen: boolean,
): string[] {
  if (!isSmallScreen) return [name]

  const words = name.trim().split(/\s+/)
  if (words.length <= 1) return [name]

  const lines: string[] = []
  let currentLine = words[0] ?? ''

  for (const word of words.slice(1)) {
    const nextLine = `${currentLine} ${word}`
    if (nextLine.length <= MOBILE_LABEL_MAX_LINE_LENGTH || lines.length === 1) {
      currentLine = nextLine
      continue
    }

    lines.push(currentLine)
    currentLine = word
  }

  lines.push(currentLine)
  return lines
}

/** `formatCurrency` puts one between a number and its unit: "$9.32 M" */
const HAIR_SPACE = String.fromCharCode(0x200a)

// Roboto Medium advance widths in em, measured in the browser.
// The layout runs before the text renders, so it can't measure the DOM.
const CHAR_WIDTHS: Record<string, number> = {
  ' ': 0.25,
  [HAIR_SPACE]: 0.08,
  '!': 0.26,
  $: 0.57,
  '%': 0.74,
  '&': 0.64,
  "'": 0.17,
  '(': 0.35,
  ')': 0.35,
  '+': 0.56,
  ',': 0.22,
  '-': 0.34,
  '−': 0.56,
  '.': 0.28,
  '/': 0.39,
  ':': 0.26,
  A: 0.66,
  B: 0.63,
  C: 0.65,
  D: 0.65,
  E: 0.57,
  F: 0.55,
  G: 0.68,
  H: 0.71,
  I: 0.28,
  J: 0.56,
  K: 0.63,
  L: 0.54,
  M: 0.87,
  N: 0.71,
  O: 0.69,
  P: 0.64,
  Q: 0.69,
  R: 0.63,
  S: 0.61,
  T: 0.61,
  U: 0.65,
  V: 0.65,
  W: 0.88,
  X: 0.63,
  Y: 0.61,
  Z: 0.6,
  a: 0.54,
  b: 0.56,
  c: 0.52,
  d: 0.56,
  e: 0.54,
  f: 0.35,
  g: 0.57,
  h: 0.56,
  i: 0.25,
  j: 0.25,
  k: 0.52,
  l: 0.25,
  m: 0.87,
  n: 0.56,
  o: 0.57,
  p: 0.56,
  q: 0.57,
  r: 0.35,
  s: 0.51,
  t: 0.33,
  u: 0.56,
  v: 0.5,
  w: 0.74,
  x: 0.5,
  y: 0.49,
  z: 0.5,
}
// Digits, and a wide guess for anything not listed
const DEFAULT_CHAR_WIDTH = 0.57

export function estimateTextWidth(text: string, fontSize: number) {
  let em = 0
  for (const char of text) em += CHAR_WIDTHS[char] ?? DEFAULT_CHAR_WIDTH
  return em * fontSize
}
