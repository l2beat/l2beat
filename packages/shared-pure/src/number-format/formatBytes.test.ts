import { describe, expect, it } from 'vitest'
import { formatBytes } from './formatBytes.js'

describe(formatBytes.name, () => {
  describe('automatic unit scaling', () => {
    it('handles 0 bytes', () => {
      expect(formatBytes(0)).toBe('0.00 B')
      expect(formatBytes(0, { decimals: 0 })).toBe('0 B')
    })

    it('bytes range', () => {
      expect(formatBytes(1)).toBe('1.00 B')
      expect(formatBytes(1023)).toBe('1023.00 B')
      expect(formatBytes(1023, { decimals: 0 })).toBe('1023 B')
    })

    it('kibibytes range', () => {
      expect(formatBytes(1024)).toBe('1.00 KiB')
      expect(formatBytes(1024 * 512)).toBe('512.00 KiB')
      expect(formatBytes(1024 * 1024 - 1)).toBe('1024.00 KiB')
    })

    it('mebibytes range', () => {
      expect(formatBytes(1024 * 1024)).toBe('1.00 MiB')
      expect(formatBytes(1024 * 1024 * 500)).toBe('500.00 MiB')
      expect(formatBytes(1024 * 1024 * 1024 - 1)).toBe('1024.00 MiB')
    })

    it('gibibytes range', () => {
      expect(formatBytes(1024 * 1024 * 1024)).toBe('1.00 GiB')
      expect(formatBytes(1024 * 1024 * 1024 * 5)).toBe('5.00 GiB')
      expect(formatBytes(1024 ** 4 - 1)).toBe('1024.00 GiB')
    })

    it('tebibytes range', () => {
      expect(formatBytes(1024 ** 4)).toBe('1.00 TiB')
      expect(formatBytes(1024 ** 5)).toBe('1024.00 TiB')
    })

    it('handles bigint input', () => {
      expect(formatBytes(1024n)).toBe('1.00 KiB')
      expect(formatBytes(1024n ** 4n)).toBe('1.00 TiB')
    })

    it('custom decimal precision', () => {
      expect(formatBytes(1536, { decimals: 0 })).toBe('2 KiB')
      expect(formatBytes(1024 * 1.5, { decimals: 3 })).toBe('1.500 KiB')
      expect(formatBytes(1024 * 1024 * 2.3456, { decimals: 1 })).toBe('2.3 MiB')
    })
  })

  describe('forced unit formatting', () => {
    it('force bytes', () => {
      expect(formatBytes(1024, { unit: 'B' })).toBe('1024.00 B')
      expect(formatBytes(1024 * 1024, { unit: 'B', decimals: 0 })).toBe(
        '1048576 B',
      )
      expect(formatBytes(1234.56, { unit: 'B' })).toBe('1234.56 B')
    })

    it('force kibibytes', () => {
      expect(formatBytes(512, { unit: 'KiB' })).toBe('0.50 KiB')
      expect(formatBytes(1024 * 5, { unit: 'KiB' })).toBe('5.00 KiB')
      expect(formatBytes(1024 * 1024 * 2, { unit: 'KiB' })).toBe('2048.00 KiB')
    })

    it('force mebibytes', () => {
      expect(formatBytes(1024, { unit: 'MiB' })).toBe('0.00 MiB')
      expect(formatBytes(1024 * 1024 * 3, { unit: 'MiB' })).toBe('3.00 MiB')
      expect(formatBytes(1024 * 1024 * 1024, { unit: 'MiB' })).toBe(
        '1024.00 MiB',
      )
    })

    it('force gibibytes', () => {
      expect(formatBytes(1024 * 1024, { unit: 'GiB' })).toBe('0.00 GiB')
      expect(formatBytes(1024 * 1024 * 1024 * 5, { unit: 'GiB' })).toBe(
        '5.00 GiB',
      )
      expect(formatBytes(1024 * 1024 * 1024 * 1024, { unit: 'GiB' })).toBe(
        '1024.00 GiB',
      )
    })

    it('edge cases with forced units', () => {
      expect(formatBytes(0, { unit: 'KiB' })).toBe('0.00 KiB')
      expect(formatBytes(1, { unit: 'GiB', decimals: 5 })).toBe('0.00000 GiB')
      expect(formatBytes(1024 ** 3 * 2.5, { unit: 'MiB', decimals: 1 })).toBe(
        '2560.0 MiB',
      )
    })
  })
})
