import { moveToMany } from './moveToMany'

export function fillBelowChart(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  canvas: HTMLCanvasElement,
  usableHeight: number,
  fillStyle: CanvasFillStrokeStyles['fillStyle'],
  opts?: {
    fade: boolean
  },
) {
  if (opts?.fade) {
    ctx.globalCompositeOperation = 'source-out'
    fadeFill(canvas, usableHeight, ctx, points)
  }

  ctx.beginPath()
  moveToMany(points, ctx, canvas, usableHeight)

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
  usableHeight: number,
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
) {
  const darkenGradient = ctx.createLinearGradient(
    0,
    usableHeight * (1 - getMedianHeight(points)),
    0,
    usableHeight,
  )
  darkenGradient.addColorStop(0, '#00000000')
  darkenGradient.addColorStop(1, '#000000')
  ctx.fillStyle = darkenGradient
  ctx.fillRect(
    0,
    usableHeight - canvas.height,
    canvas.width,
    usableHeight + (usableHeight - canvas.height),
  )
}

function getMedianHeight(points: { x: number; y: number }[]) {
  const y = points.map(({ y }) => y)
  y.sort((a, b) => a - b)

  return y.length % 2 === 0
    ? y[Math.floor(y.length / 2)]
    : (y[Math.floor(y.length / 2)] + y[Math.floor(y.length / 2) + 1]) / 2
}
