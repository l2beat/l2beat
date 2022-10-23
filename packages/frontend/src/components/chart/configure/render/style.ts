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
