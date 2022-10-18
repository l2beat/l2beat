import { calculateTicks } from './calculateTicks'

export function getYAxis(
  values: number[],
  labelCount: number,
  isLogScale: boolean,
  format: (value: number) => string,
) {
  const ticks = calculateTicks(labelCount, values, isLogScale)
  const labels = ticks.map(format)
  const min = ticks[0]
  const max = ticks[ticks.length - 1]
  const getY = isLogScale ? getLogY(min, max) : getLinY(min, max)
  return {
    labels,
    getY,
  }
}
function getLinY(min: number, max: number) {
  return function getY(value: number) {
    return (value - min) / (max - min)
  }
}
function getLogY(min: number, max: number) {
  return function getY(value: number) {
    if (value === 0) {
      return -1
    }
    return (Math.log(value) - Math.log(min)) / (Math.log(max) - Math.log(min))
  }
}
