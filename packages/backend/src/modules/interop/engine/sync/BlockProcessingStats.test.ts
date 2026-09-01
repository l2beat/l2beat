import { expect } from 'earl'
import { BlockProcessingStats } from './BlockProcessingStats'

describe(BlockProcessingStats.name, () => {
  it('keeps raw totals and averages until display time', () => {
    const stats = new BlockProcessingStats()

    stats.record(1.25, 0.5)
    stats.record(1.25, 0.75)

    expect(stats.get()).toEqual({
      totalMs: 2.5,
      cpuMs: 1.25,
      count: 2,
      avgMs: 1.25,
      avgCpuMs: 0.625,
    })
  })
})
