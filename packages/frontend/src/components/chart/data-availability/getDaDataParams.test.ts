import { expect } from 'earl'
import { formatDaAxisTick } from './getDaDataParams'

describe(formatDaAxisTick.name, () => {
  // Ticks of a ~5 MiB series on a GiB axis, which hidden projects can force
  it('keeps sub-hundredth ticks distinct', () => {
    expect([0, 0.002, 0.004, 0.006].map(formatDaAxisTick)).toEqual([
      '0.00',
      '0.0020',
      '0.0040',
      '0.0060',
    ])
  })

  it('rounds ticks of 1 and above to two decimals', () => {
    expect([1.5, 12.346].map(formatDaAxisTick)).toEqual(['1.50', '12.35'])
  })
})
