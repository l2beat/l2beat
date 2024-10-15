import { oklch2rgb } from './oklch'

// l :: 0 - 1
// c :: 0 - 0.37
// h :: 0 - 360
export interface OklchColor {
  l: number
  c: number
  h: number
}

export interface RGBColor {
  r: number
  g: number
  b: number
}

export const White: OklchColor = { l: 100, c: 0, h: 106 }

export function oklchColorToCSS(color: OklchColor | undefined): string {
  const { r, g, b } = oklch2rgb(color ?? White)
  return `rgb(${r}, ${g}, ${b})`
}
