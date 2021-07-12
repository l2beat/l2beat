import { ChartInput } from './ChartInput'

export function plot(
  chart: ChartInput,
  period: number,
  ctx: CanvasRenderingContext2D
) {
  const canvas = ctx.canvas
  const box = canvas.getBoundingClientRect()
  canvas.width = box.width
  canvas.height = box.height

  const isLastN =
    (n: number) =>
    <T>(v: T, i: number, arr: T[]) =>
      i > arr.length - 1 - n
  const entries = chart.data.map((x) => x[1]).filter(isLastN(period))

  const min = Math.min(...entries)
  const max = Math.max(...entries)
  const diff = max - min
  const chartMin = Math.max(0, min - diff / 20)
  const chartMax = max + diff / 20

  const toChartX = (i: number) => (i / (entries.length - 1)) * canvas.width
  const toChartY = (x: number) =>
    (1 - (x - chartMin) / (chartMax - chartMin)) * canvas.height

  ctx.beginPath()
  ctx.moveTo(0, toChartY(entries[0]))
  for (let i = 1; i < entries.length; i++) {
    ctx.lineTo(toChartX(i), toChartY(entries[i]))
  }

  const strokeGradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
  const fillGradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
  const style = getComputedStyle(canvas)

  strokeGradient.addColorStop(0, style.getPropertyValue('--gradient-1'))
  fillGradient.addColorStop(0, style.getPropertyValue('--gradient-1') + '60')
  strokeGradient.addColorStop(0.5, style.getPropertyValue('--gradient-2'))
  fillGradient.addColorStop(0.5, style.getPropertyValue('--gradient-2') + '60')
  strokeGradient.addColorStop(1, style.getPropertyValue('--gradient-3'))
  fillGradient.addColorStop(1, style.getPropertyValue('--gradient-3') + '60')

  ctx.strokeStyle = strokeGradient
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.lineTo(canvas.width, canvas.height)
  ctx.lineTo(0, canvas.height)
  ctx.closePath()
  ctx.fillStyle = fillGradient
  ctx.fill()
}
