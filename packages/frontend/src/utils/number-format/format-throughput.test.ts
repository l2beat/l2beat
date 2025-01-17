import { expect } from 'earl'
import { type SizeUnit, formatThroughput } from './format-throughput'

describe('formatThroughput', () => {
  it('formats basic throughput correctly', () => {
    expect(formatThroughput(100, 1)).toEqual('100 B/s')
    expect(formatThroughput(1000, 1)).toEqual('1 KB/s')
    expect(formatThroughput(1_000_000, 1)).toEqual('1 MB/s')
  })

  it('handles different time frequencies', () => {
    expect(formatThroughput(300, 2)).toEqual('150 B/s')
    expect(formatThroughput(3000, 3)).toEqual('1 KB/s')
    expect(formatThroughput(6_000_000, 2)).toEqual('3 MB/s')
  })

  it('handles custom fromUnit', () => {
    expect(formatThroughput(1, 1, { fromUnit: 'KB' })).toEqual('1 KB/s')
    expect(formatThroughput(1000, 1, { fromUnit: 'KB' })).toEqual('1 MB/s')
    expect(formatThroughput(1, 1, { fromUnit: 'MB' })).toEqual('1 MB/s')
    expect(formatThroughput(2, 6, { fromUnit: 'MB' })).toEqual('0.33 MB/s')
  })

  it('handles exact flag', () => {
    expect(formatThroughput(1234.5678, 1, { exact: true })).toEqual(
      '1.2345678 KB/s',
    )
    expect(formatThroughput(1234.5678, 1, { exact: false })).toEqual(
      '1.23 KB/s',
    )
  })

  it('throws error for invalid unit', () => {
    expect(() =>
      formatThroughput(100, 1, { fromUnit: 'invalid' as SizeUnit }),
    ).toThrow('Invalid unit: invalid')
  })

  it('handles edge cases', () => {
    expect(formatThroughput(0, 1)).toEqual('0 B/s')
    expect(formatThroughput(999, 1)).toEqual('999 B/s')
    expect(formatThroughput(1000, 1)).toEqual('1 KB/s')
    expect(formatThroughput(1_000_000_000_000, 1)).toEqual('1 TB/s')
  })
})
