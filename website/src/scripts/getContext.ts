export function getContext(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Cannot get canvas context!')
  }
  return ctx
}
