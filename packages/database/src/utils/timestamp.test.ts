import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { fromTimestamp, toTimestamp } from './timestamp'

describe('timestamp utilities', () => {
  describe(fromTimestamp.name, () => {
    it('converts UnixTime to Date', () => {
      const unixTime = UnixTime(1609459200) // 2021-01-01T00:00:00Z
      const result = fromTimestamp(unixTime)
      expect(result).toEqual(new Date('2021-01-01T00:00:00Z'))
    })

    it('returns null when input is null', () => {
      const result = fromTimestamp(null)
      expect(result).toEqual(null)
    })

    it('returns undefined when input is undefined', () => {
      const result = fromTimestamp(undefined)
      expect(result).toEqual(undefined)
    })

    it('handles epoch timestamp', () => {
      const unixTime = UnixTime(0)
      const result = fromTimestamp(unixTime)
      expect(result).toEqual(new Date('1970-01-01T00:00:00Z'))
    })
  })

  describe(toTimestamp.name, () => {
    it('converts Date to UnixTime', () => {
      const date = new Date('2021-01-01T00:00:00Z')
      const result = toTimestamp(date)
      expect(result).toEqual(UnixTime(1609459200))
    })

    it('returns null when input is null', () => {
      const result = toTimestamp(null)
      expect(result).toEqual(null)
    })
  })
})
