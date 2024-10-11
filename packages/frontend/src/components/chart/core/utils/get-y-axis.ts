import { assert } from '@l2beat/shared-pure'
import { calculateTicks } from './calculate-ticks'

export function getYAxis(
  values: number[],
  isLogScale: boolean,
  format: (value: number) => string,
  labelCount = 2,
) {
  if (values.length === 0) {
    return {
      labels: new Array(labelCount).fill(''),
      getY: () => -1,
    }
  }
  const ticks = calculateTicks(labelCount + 1, values, isLogScale)
  const labels = ticks.slice(1).map(format)
  const min = ticks[0]
  const max = ticks[ticks.length - 1]
  assert(min !== undefined && max !== undefined, 'No min or max')
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
