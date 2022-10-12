import { Point } from '../ui'
import { path } from './path'

export function stroke(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  canvas: HTMLCanvasElement,
  strokeStyle: CanvasGradient,
) {
  ctx.beginPath()
  path(points, ctx, canvas)

  ctx.strokeStyle = strokeStyle
  ctx.lineWidth = Math.floor(2 * window.devicePixelRatio)
  ctx.lineJoin = 'round'
  ctx.stroke()
}
