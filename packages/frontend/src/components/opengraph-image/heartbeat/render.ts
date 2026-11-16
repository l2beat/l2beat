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

/**
 * Draws SVG decoration as a PNG data URI, so images that share it can reuse
 * one drawing: the glow's blurs take most of an image's render time.
 */
export function rasterize(body: string) {
  return `data:image/png;base64,${draw(body).asPng().toString('base64')}`
}

/**
 * Where drawn SVG starts and ends on each canvas row. An empty row starts at
 * Infinity and ends at -Infinity, so it never counts as covered.
 */
export function rowExtents(body: string) {
  const { pixels } = draw(body)
  const { width, height } = OG_SIZE
  const painted = (x: number, y: number) =>
    (pixels[(y * width + x) * 4 + 3] ?? 0) >= 128
  return Array.from({ length: height }, (_, y) => {
    let start = 0
    while (start < width && !painted(start, y)) start++
    let end = width - 1
    while (end > start && !painted(end, y)) end--
    return start < width
      ? { start, end }
      : { start: Number.POSITIVE_INFINITY, end: Number.NEGATIVE_INFINITY }
  })
}

/** A box by its edges. */
export interface Box {
  x0: number
  y0: number
  x1: number
  y1: number
}

/** The box drawn SVG covers on the canvas. */
export function drawnBox(body: string): Box {
  const rows = rowExtents(body)
  const drawn = rows.flatMap((row, y) => (row.start <= row.end ? [y] : []))
  return {
    x0: Math.min(...rows.map((row) => row.start)),
    y0: Math.min(...drawn),
    x1: Math.max(...rows.map((row) => row.end)) + 1,
    y1: Math.max(...drawn) + 1,
  }
}

function draw(body: string) {
  const { width, height } = OG_SIZE
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`
  return new Resvg(svg, { font: { loadSystemFonts: false } }).render()
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
