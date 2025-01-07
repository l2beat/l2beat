import { expect } from 'earl'
import { type SizeUnit, formatSize } from './format-size'

describe(formatSize.name, () => {
  it('formats bytes correctly', () => {
    expect(formatSize(500)).toEqual('500 B')
    expect(formatSize(999)).toEqual('999 B')
    expect(formatSize(1000)).toEqual('1 KB')
    expect(formatSize(1500)).toEqual('1.5 KB')
    expect(formatSize(1000000)).toEqual('1 MB')
    expect(formatSize(1000000000)).toEqual('1 GB')
    expect(formatSize(1000000000000)).toEqual('1 TB')
  })

  it('handles custom fromUnit', () => {
    expect(formatSize(5, { fromUnit: 'KB' })).toEqual('5 KB')
    expect(formatSize(1000, { fromUnit: 'KB' })).toEqual('1 MB')
    expect(formatSize(2000, { fromUnit: 'MB' })).toEqual('2 GB')
  })

  it('handles exact option', () => {
    expect(formatSize(1536, { exact: true })).toEqual('1.536 KB')
    expect(formatSize(1536, { exact: false })).toEqual('1.54 KB')
  })

  it('throws error for invalid unit', () => {
    expect(() => formatSize(500, { fromUnit: 'invalid' as SizeUnit })).toThrow(
      'Invalid unit: invalid',
    )
  })
})
