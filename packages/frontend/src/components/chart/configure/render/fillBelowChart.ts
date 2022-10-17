import { moveToMany } from './moveToMany'

export function fillBelowChart(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  canvas: HTMLCanvasElement,
  fillStyle: CanvasGradient,
  opts?: {
    fade: boolean
  },
) {
  if (opts?.fade) {
    ctx.globalCompositeOperation = 'source-out'
    fadeFill(canvas, ctx, points)
  }

  ctx.beginPath()
  moveToMany(points, ctx, canvas)

  ctx.fillStyle = fillStyle
  ctx.lineTo(canvas.width, canvas.height)
  ctx.lineTo(0, canvas.height)
  ctx.closePath()
  ctx.fill()

  if (opts?.fade) {
    ctx.globalCompositeOperation = 'source-over'
  }
}

function fadeFill(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
) {
  const darkenGradient = ctx.createLinearGradient(
    0,
    canvas.height * (1 - getMedianHeight(points)),
    0,
    canvas.height,
  )
  darkenGradient.addColorStop(0, '#00000000')
  darkenGradient.addColorStop(1, '#000000')
  ctx.fillStyle = darkenGradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function getMedianHeight(points: { x: number; y: number }[]) {
  const y = points.map(({ y }) => y)
  y.sort((a, b) => a - b)

  return y.length % 2 === 0
    ? y[Math.floor(y.length / 2)]
    : (y[Math.floor(y.length / 2)] + y[Math.floor(y.length / 2) + 1]) / 2
}
