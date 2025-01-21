import { expect } from 'earl'
import { formatThroughput } from './format-throughput'

describe('formatThroughput', () => {
  it('formats basic throughput correctly', () => {
    expect(formatThroughput(1_000, 1)).toEqual('1 MB/s')
    expect(formatThroughput(2_000, 1)).toEqual('2 MB/s')
    expect(formatThroughput(500, 1)).toEqual('0.5 MB/s')
  })

  it('handles different time frequencies', () => {
    expect(formatThroughput(3_000, 2)).toEqual('1.5 MB/s')
    expect(formatThroughput(6_000, 3)).toEqual('2 MB/s')
    expect(formatThroughput(6_000, 2)).toEqual('3 MB/s')
  })

  it('rounds to 4 decimal places at most', () => {
    expect(formatThroughput(1_234, 1)).toEqual('1.23 MB/s')
    expect(formatThroughput(9_876, 1)).toEqual('9.88 MB/s')
    expect(formatThroughput(500, 12)).toEqual('0.0417 MB/s')
  })

  it('handles some of the actual cases', () => {
    expect(formatThroughput(2000, 20)).toEqual('0.1 MB/s')
    expect(formatThroughput(750, 12)).toEqual('0.0625 MB/s')
    expect(formatThroughput(16000, 1)).toEqual('16 MB/s')
  })

  it('handles zero bytes', () => {
    expect(formatThroughput(0, 1)).toEqual('0 MB/s')
  })

  it('throws when frequency is zero', () => {
    expect(() => formatThroughput(1000, 0)).toThrow('Frequency cannot be zero.')
  })
})
