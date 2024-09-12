export interface Color {
  r: number
  g: number
  b: number
}

export const White: Color = { r: 255, g: 255, b: 255 }

export function colorToCSS(c: Color | undefined): string {
  const { r, g, b } = c ?? White
  return `rgb(${r}, ${g}, ${b})`
}
