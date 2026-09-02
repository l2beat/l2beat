import { expect } from 'earl'
import { formatDaThroughputValue } from './formatDaThroughputValue'

describe(formatDaThroughputValue.name, () => {
  it('uses MiB for a MiB-sized point on a GiB-scaled chart', () => {
    expect(formatDaThroughputValue(0.004, 1024 ** 3)).toEqual('4.10 MiB')
  })

  it('uses KiB for a KiB-sized point on a GiB-scaled chart', () => {
    expect(formatDaThroughputValue(0.000004, 1024 ** 3)).toEqual('4.19 KiB')
  })
})
