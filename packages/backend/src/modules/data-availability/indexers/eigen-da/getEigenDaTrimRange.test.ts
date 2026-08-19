import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getEigenDaTrimRange } from './getEigenDaTrimRange'

describe(getEigenDaTrimRange.name, () => {
  const H = UnixTime.HOUR
  const T0 = UnixTime.fromDate(new Date('2025-08-01T00:00:00Z'))

  describe('sinceTimestamp raised - range is [oldSince, newSince - 1]', () => {
    it('deletes all buckets before a full-hour since', () => {
      expect(getEigenDaTrimRange([T0, T0 + 3 * H - 1])).toEqual([
        T0,
        T0 + 3 * H - 1,
      ])
    })

    it('keeps the bucket containing a mid-hour since', () => {
      const newSince = T0 + 3 * H + 600
      expect(getEigenDaTrimRange([T0, newSince - 1])).toEqual([
        T0,
        T0 + 3 * H - 1,
      ])
    })

    it('deletes nothing when both sinces fall into the same hour', () => {
      const [from, to] = getEigenDaTrimRange([T0 + 600, T0 + 1200 - 1])
      expect(from).toBeGreaterThan(to)
    })
  })

  describe('untilTimestamp lowered - range is [newUntil + 1, currentHeight]', () => {
    it('deletes the bucket starting at a full-hour until', () => {
      expect(getEigenDaTrimRange([T0 + 3 * H + 1, T0 + 10 * H])).toEqual([
        T0 + 3 * H,
        T0 + 10 * H - 1,
      ])
    })

    it('deletes the bucket containing a mid-hour until', () => {
      const newUntil = T0 + 3 * H + 600
      expect(getEigenDaTrimRange([newUntil + 1, T0 + 10 * H])).toEqual([
        T0 + 3 * H,
        T0 + 10 * H - 1,
      ])
    })
  })
})
