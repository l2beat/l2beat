/**
 * Returns a context that draws in CSS pixels. Density is capped at 2: past it,
 * a full-card canvas costs more to fill than the eye can tell apart.
 */
export function prepareCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
): CanvasRenderingContext2D | null {
  const density = Math.min(window.devicePixelRatio || 1, 2)
  const pixelWidth = Math.max(1, Math.round(width * density))
  const pixelHeight = Math.max(1, Math.round(height * density))
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth
    canvas.height = pixelHeight
  }
  const context = canvas.getContext('2d')
  context?.setTransform(density, 0, 0, density, 0, 0)
  return context
}
