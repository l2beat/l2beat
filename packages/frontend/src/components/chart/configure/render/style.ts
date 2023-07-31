import { moveToMany } from './moveToMany'

export function getMainStyle(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) {
  const style = getComputedStyle(canvas)

  const strokeGradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
  strokeGradient.addColorStop(0, style.getPropertyValue('--gradient-1'))
  strokeGradient.addColorStop(0.5, style.getPropertyValue('--gradient-2'))
  strokeGradient.addColorStop(1, style.getPropertyValue('--gradient-3'))

  const fillGradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
  fillGradient.addColorStop(0, style.getPropertyValue('--gradient-1-light'))
  fillGradient.addColorStop(0.5, style.getPropertyValue('--gradient-2-light'))
  fillGradient.addColorStop(1, style.getPropertyValue('--gradient-3-light'))
  return { strokeGradient, fillGradient }
}

export function getSecondaryStyle(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) {
  const style = getComputedStyle(canvas)

  const strokeGradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
  strokeGradient.addColorStop(0, style.getPropertyValue('--second-gradient-1'))
  strokeGradient.addColorStop(1, style.getPropertyValue('--second-gradient-2'))

  const fillGradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
  fillGradient.addColorStop(
    0,
    style.getPropertyValue('--second-gradient-1-light'),
  )
  fillGradient.addColorStop(
    1,
    style.getPropertyValue('--second-gradient-2-light'),
  )

  return { strokeGradient, fillGradient }
}

export function getCBVStyle(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
): CanvasFillStrokeStyles['fillStyle'] {
  const fillStyle = '#7E41CC'

  const drawCmd = (
    patternCanvas: HTMLCanvasElement,
    patternCtx: CanvasRenderingContext2D,
  ) => {
    patternCtx.fillStyle = fillStyle
    patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height)
    patternCtx.beginPath()

    patternCtx.fillStyle = 'rgba(255,255,255,0.1)'
    patternCtx.strokeStyle = 'rgba(255,255,255,0.1)'

    const denorm = 10
    const r = patternCanvas.width / denorm

    patternCtx.arc(r, r, r, 0, 2 * Math.PI)
    patternCtx.moveTo(patternCanvas.width - r, patternCanvas.width - r)
    patternCtx.arc(
      patternCanvas.width - r,
      patternCanvas.width - r,
      r,
      0,
      2 * Math.PI,
    )

    patternCtx.fill()
    patternCtx.stroke()
  }

  return createPattern(canvas, ctx, drawCmd) ?? fillStyle
}

export function getEBVStyle(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
): CanvasFillStrokeStyles['fillStyle'] {
  const fillStyle = '#FFC107'

  const drawCmd = (
    patternCanvas: HTMLCanvasElement,
    patternCtx: CanvasRenderingContext2D,
  ) => {
    patternCtx.fillStyle = fillStyle
    patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height)
    patternCtx.beginPath()
    patternCtx.strokeStyle = 'rgba(255,255,255,0.5)'
    moveToMany(
      [
        { x: 0.0, y: 0.0 },
        { x: 0.5, y: 0.0 },
        { x: 0.25, y: 0.25 },
        { x: 0.0, y: 0.0 },
      ],
      patternCtx,
      patternCanvas,
      patternCanvas.height,
    )

    moveToMany(
      [
        { x: 0.5, y: 0.5 },
        { x: 1.0, y: 0.5 },
        { x: 0.75, y: 0.75 },
        { x: 0.5, y: 0.5 },
      ],
      patternCtx,
      patternCanvas,
      patternCanvas.height,
    )
    patternCtx.stroke()
  }

  return createPattern(canvas, ctx, drawCmd) ?? fillStyle
}

export function getNMVStyle(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
): CanvasFillStrokeStyles['fillStyle'] {
  const fillStyle = '#FF46C0'

  const drawCmd = (
    patternCanvas: HTMLCanvasElement,
    patternCtx: CanvasRenderingContext2D,
  ) => {
    patternCtx.fillStyle = fillStyle
    patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height)
    patternCtx.beginPath()
    patternCtx.strokeStyle = 'rgba(255,255,255,0.5)'
    moveToMany(
      [
        { x: 0.0, y: 0.0 },
        { x: 0.5, y: 0.0 },
        { x: 0.5, y: 0.25 },
        { x: 0.0, y: 0.25 },
        { x: 0.0, y: 0.0 },
      ],
      patternCtx,
      patternCanvas,
      patternCanvas.height,
    )

    moveToMany(
      [
        { x: 0.5, y: 0.5 },
        { x: 1.0, y: 0.5 },
        { x: 1.0, y: 0.75 },
        { x: 0.5, y: 0.75 },
        { x: 0.5, y: 0.5 },
      ],
      patternCtx,
      patternCanvas,
      patternCanvas.height,
    )
    patternCtx.stroke()
  }

  return createPattern(canvas, ctx, drawCmd) ?? fillStyle
}

function createPattern(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  drawCmd: (
    patternCanvas: HTMLCanvasElement,
    patternCtx: CanvasRenderingContext2D,
  ) => void,
) {
  const patternCanvas = document.createElement('canvas')
  const patternCtx = patternCanvas.getContext('2d')
  if (!patternCtx) {
    return null
  }

  patternCanvas.width = canvas.width / 48
  patternCanvas.height = (patternCanvas.width / 4) * Math.sqrt(3) * 4

  drawCmd(patternCanvas, patternCtx)

  const pattern = ctx.createPattern(patternCanvas, 'repeat')
  return pattern
}
