export { starknetKeccak } from '@l2beat/discovery'

export function segmentRange(
  start: number,
  end: number,
  batchSize: number,
): [number, number][] {
  if (start > end) {
    throw new Error('Start index cannot be greater than end index')
  }

  if (batchSize <= 0) {
    throw new Error('Batch size must be a positive number')
  }

  const result: [number, number][] = []

  for (let i = start; i <= end; i += batchSize) {
    const batchEnd = Math.min(i + batchSize - 1, end)
    result.push([i, batchEnd])
  }

  return result
}
