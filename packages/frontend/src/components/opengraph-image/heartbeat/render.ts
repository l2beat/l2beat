import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { Resvg } from '@resvg/resvg-js'
import type { ReactNode } from 'react'
import satori from 'satori'
import {
  createTextMeasure,
  type OpengraphFonts,
  satoriFonts,
  type TextMeasure,
} from './text'

export const OG_SIZE = { width: 1200, height: 630 }

export interface OpengraphKit {
  fonts: OpengraphFonts
  measure: TextMeasure
}

export async function loadOpengraphKit(
  staticDir: string,
): Promise<OpengraphKit> {
  const [semiBold, bold] = await Promise.all([
    readFile(path.join(staticDir, 'fonts/roboto/roboto-latin-600.ttf')),
    readFile(path.join(staticDir, 'fonts/roboto/roboto-latin-700.ttf')),
  ])
  const fonts = { semiBold, bold }
  return { fonts, measure: createTextMeasure(fonts) }
}

// Satori masks almost every element with one full-canvas rect. Dropping that
// mask renders the same pixels, and resvg no longer draws it offscreen each time.
const ROOT_MASK = /\s?mask="url\(#satori_om-id\)"/g

export async function renderOpengraphPng(
  element: ReactNode,
  kit: OpengraphKit,
) {
  const svg = await renderOpengraphSvg(element, kit)
  return new Resvg(svg, { font: { loadSystemFonts: false } }).render().asPng()
}

export async function renderOpengraphSvg(
  element: ReactNode,
  kit: OpengraphKit,
) {
  const svg = await satori(element, {
    ...OG_SIZE,
    fonts: [...satoriFonts(kit.fonts)],
  })
  return svg.replace(ROOT_MASK, '')
}
