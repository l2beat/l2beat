import { moveToMany } from './moveToMany'

export function strokeChartLine(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  canvas: HTMLCanvasElement,
  usableHeight: number,
  strokeStyle: CanvasFillStrokeStyles['strokeStyle'],
) {
  ctx.beginPath()
  moveToMany(points, ctx, canvas, usableHeight)

  ctx.strokeStyle = strokeStyle
  ctx.lineWidth = Math.floor(2 * window.devicePixelRatio)
  ctx.lineJoin = 'round'
  ctx.stroke()
}
