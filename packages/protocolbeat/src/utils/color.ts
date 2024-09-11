export interface Color {
  r: number
  g: number
  b: number
}

export function colorToCSS(c: Color | undefined): string {
  const { r, g, b } = c ?? { r: 255, g: 255, b: 255 }
  return `rgb(${r}, ${g}, ${b})`
}
