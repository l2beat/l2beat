import { expect } from 'earl'
import { formatBytes } from './formatBytes'

describe(formatBytes.name, () => {
  describe('automatic unit scaling', () => {
    it('handles 0 bytes', () => {
      expect(formatBytes(0)).toEqual('0.00 B')
      expect(formatBytes(0, { decimals: 0 })).toEqual('0 B')
    })

    it('bytes range', () => {
      expect(formatBytes(1)).toEqual('1.00 B')
      expect(formatBytes(1023)).toEqual('1023.00 B')
      expect(formatBytes(1023, { decimals: 0 })).toEqual('1023 B')
    })

    it('kibibytes range', () => {
      expect(formatBytes(1024)).toEqual('1.00 KiB')
      expect(formatBytes(1024 * 512)).toEqual('512.00 KiB')
      expect(formatBytes(1024 * 1024 - 1)).toEqual('1024.00 KiB')
    })

    it('mebibytes range', () => {
      expect(formatBytes(1024 * 1024)).toEqual('1.00 MiB')
      expect(formatBytes(1024 * 1024 * 500)).toEqual('500.00 MiB')
      expect(formatBytes(1024 * 1024 * 1024 - 1)).toEqual('1024.00 MiB')
    })

    it('gibibytes range', () => {
      expect(formatBytes(1024 * 1024 * 1024)).toEqual('1.00 GiB')
      expect(formatBytes(1024 * 1024 * 1024 * 5)).toEqual('5.00 GiB')
      expect(formatBytes(1024 * 1024 * 1024 * 1024)).toEqual('1024.00 GiB')
    })

    it('custom decimal precision', () => {
      expect(formatBytes(1536, { decimals: 0 })).toEqual('2 KiB')
      expect(formatBytes(1024 * 1.5, { decimals: 3 })).toEqual('1.500 KiB')
      expect(formatBytes(1024 * 1024 * 2.3456, { decimals: 1 })).toEqual(
        '2.3 MiB',
      )
    })
  })

  describe('forced unit formatting', () => {
    it('force bytes', () => {
      expect(formatBytes(1024, { unit: 'B' })).toEqual('1024.00 B')
      expect(formatBytes(1024 * 1024, { unit: 'B', decimals: 0 })).toEqual(
        '1048576 B',
      )
      expect(formatBytes(1234.56, { unit: 'B' })).toEqual('1234.56 B')
    })

    it('force kibibytes', () => {
      expect(formatBytes(512, { unit: 'KiB' })).toEqual('0.50 KiB')
      expect(formatBytes(1024 * 5, { unit: 'KiB' })).toEqual('5.00 KiB')
      expect(formatBytes(1024 * 1024 * 2, { unit: 'KiB' })).toEqual(
        '2048.00 KiB',
      )
    })

    it('force mebibytes', () => {
      expect(formatBytes(1024, { unit: 'MiB' })).toEqual('0.00 MiB')
      expect(formatBytes(1024 * 1024 * 3, { unit: 'MiB' })).toEqual('3.00 MiB')
      expect(formatBytes(1024 * 1024 * 1024, { unit: 'MiB' })).toEqual(
        '1024.00 MiB',
      )
    })

    it('force gibibytes', () => {
      expect(formatBytes(1024 * 1024, { unit: 'GiB' })).toEqual('0.00 GiB')
      expect(formatBytes(1024 * 1024 * 1024 * 5, { unit: 'GiB' })).toEqual(
        '5.00 GiB',
      )
      expect(formatBytes(1024 * 1024 * 1024 * 1024, { unit: 'GiB' })).toEqual(
        '1024.00 GiB',
      )
    })

    it('edge cases with forced units', () => {
      expect(formatBytes(0, { unit: 'KiB' })).toEqual('0.00 KiB')
      expect(formatBytes(1, { unit: 'GiB', decimals: 5 })).toEqual(
        '0.00000 GiB',
      )
      expect(
        formatBytes(1024 ** 3 * 2.5, { unit: 'MiB', decimals: 1 }),
      ).toEqual('2560.0 MiB')
    })
  })
})
