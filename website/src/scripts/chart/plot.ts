import { Outputs } from './getOutputs'
import { UiState } from './ui'

export function plot(uiState: UiState, outputs: Outputs) {
  outputs.range.innerHTML = uiState.dateRange
  outputs.description.innerHTML = uiState.description
  for (let i = 0; i < 5; i++) {
    outputs.labels[i].innerHTML = uiState.labels[4 - i]
  }

  const canvas = outputs.canvas
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ctx = canvas.getContext('2d')!
  const box = canvas.getBoundingClientRect()
  canvas.width = box.width * window.devicePixelRatio
  canvas.height = box.height * window.devicePixelRatio

  ctx.beginPath()
  for (const [i, { x, y }] of uiState.points.entries()) {
    if (i === 0) {
      ctx.moveTo(x * canvas.width, (1 - y) * canvas.height)
    } else {
      ctx.lineTo(x * canvas.width, (1 - y) * canvas.height)
    }
  }

  const style = getComputedStyle(canvas)

  const strokeGradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
  strokeGradient.addColorStop(0, style.getPropertyValue('--gradient-1'))
  strokeGradient.addColorStop(0.5, style.getPropertyValue('--gradient-2'))
  strokeGradient.addColorStop(1, style.getPropertyValue('--gradient-3'))

  const fillGradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
  fillGradient.addColorStop(0, style.getPropertyValue('--gradient-1') + '60')
  fillGradient.addColorStop(0.5, style.getPropertyValue('--gradient-2') + '60')
  fillGradient.addColorStop(1, style.getPropertyValue('--gradient-3') + '60')

  ctx.strokeStyle = strokeGradient
  ctx.fillStyle = fillGradient
  ctx.lineWidth = Math.floor(2 * window.devicePixelRatio)
  ctx.lineJoin = 'round'
  ctx.stroke()

  ctx.lineTo(canvas.width, canvas.height)
  ctx.lineTo(0, canvas.height)
  ctx.closePath()
  ctx.fill()
}
