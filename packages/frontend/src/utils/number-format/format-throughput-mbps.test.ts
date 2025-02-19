import { expect } from 'earl'
import { formatThroughputMBPS } from './format-throughput-mbps'

describe('formatThroughputMBPS', () => {
  it('formats basic throughput correctly', () => {
    expect(formatThroughputMBPS(1048576)).toEqual('1 MiB/s')
    expect(formatThroughputMBPS(2097152)).toEqual('2 MiB/s')
    expect(formatThroughputMBPS(524288)).toEqual('0.5 MiB/s')
  })

  it('rounds to 4 decimal places at most', () => {
    expect(formatThroughputMBPS(1_234)).toEqual('1.23 MiB/s')
    expect(formatThroughputMBPS(9_876)).toEqual('9.88 MiB/s')
    expect(formatThroughputMBPS(43725)).toEqual('0.0417 MiB/s')
  })

  it('handles some of the actual cases', () => {
    expect(formatThroughputMBPS(524288)).toEqual('0.5 MiB/s')
    expect(formatThroughputMBPS(65536)).toEqual('0.0625 MiB/s')
    expect(formatThroughputMBPS(16777216)).toEqual('16 MiB/s')
  })

  it('handles zero bytes', () => {
    expect(formatThroughputMBPS(0)).toEqual('0 MiB/s')
  })
})
