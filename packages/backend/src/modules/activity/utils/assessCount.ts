import type { AdjustCount } from '@l2beat/config'

export function assessCount(
  adjustCount: AdjustCount | undefined,
): (count: number, block: number) => number {
  if (!adjustCount) {
    return (count) => count
  }
  if (adjustCount.type === 'SubtractOne') {
    return (count) => count - 1
  }
  if (adjustCount.type === 'SubtractOneSinceBlock') {
    return (count: number, block: number) =>
      block >= adjustCount.blockNumber ? count - 1 : count
  }
  if (adjustCount.type === 'SubtractSinceBlocks') {
    const steps = [...adjustCount.steps].sort(
      (a, b) => a.blockNumber - b.blockNumber,
    )
    return (count: number, block: number) => {
      let subtract = 0
      for (const step of steps) {
        if (block >= step.blockNumber) subtract = step.count
      }
      return count - subtract
    }
  }
  throw new Error('Unknown config for adjustCount')
}
