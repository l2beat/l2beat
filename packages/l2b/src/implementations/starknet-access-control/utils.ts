import { utils } from 'ethers/lib/ethers'

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

export function starknetKeccak(data: Buffer): string {
  const MASK_250 = BigInt(
    '0x03ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  )
  const hash = utils.keccak256(data)
  const hashInt = BigInt('0x' + hash.slice(2))

  return `0x${(hashInt & MASK_250).toString(16)}`
}
