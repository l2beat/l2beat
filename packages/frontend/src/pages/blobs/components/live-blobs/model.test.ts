import type { DaLayerThroughput } from '@l2beat/config'
import { expect } from 'earl'
import { getBlockLimits, nextLimitsIn } from './model'

// Methodology: two configured throughputs, one in force and one to come, as
// Ethereum's forks raise the blob limits.
describe(nextLimitsIn.name, () => {
  const KIB = 1024
  const throughputs: DaLayerThroughput[] = [
    {
      size: 6 * 128 * KIB,
      target: 3 * 128 * KIB,
      frequency: 12,
      sinceTimestamp: 1000,
    },
    {
      size: 9 * 128 * KIB,
      target: 6 * 128 * KIB,
      frequency: 12,
      sinceTimestamp: 5000,
    },
  ]

  it('tells how long the limits in force hold', () => {
    expect(nextLimitsIn(throughputs, 1200)).toEqual(3800)
    expect(getBlockLimits(throughputs, 1200).maxBlobsPerBlock).toEqual(6)
  })

  it('tells nothing once the last configured limits are in force', () => {
    expect(nextLimitsIn(throughputs, 5000)).toEqual(undefined)
    expect(getBlockLimits(throughputs, 5000).maxBlobsPerBlock).toEqual(9)
  })
})
