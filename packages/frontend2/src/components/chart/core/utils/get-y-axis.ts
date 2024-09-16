import { assert } from '@l2beat/shared-pure'
import { calculateTicks } from './calculate-ticks'

export function getYAxis(
  values: number[],
  format: (value: number) => string,
  labelCount = 5,
) {
  if (values.length === 0) {
    return {
      labels: new Array(labelCount).fill(''),
      getY: () => -1,
    }
  }
  const ticks = calculateTicks(labelCount, values)
  const labels = ticks.map(format)
  const min = ticks[0]
  const max = ticks[ticks.length - 1]
  assert(min !== undefined && max !== undefined, 'No min or max')
  const getY = (value: number) => (value - min) / (max - min)
  return {
    labels,
    getY,
  }
}
