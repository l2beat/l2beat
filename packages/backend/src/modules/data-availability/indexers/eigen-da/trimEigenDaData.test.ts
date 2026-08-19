import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getEigenDaTrimRange } from './trimEigenDaData'

const HOUR = UnixTime.HOUR
const START = UnixTime.fromDate(new Date('2025-09-01T00:00:00Z'))

describe(getEigenDaTrimRange.name, () => {
  describe('head trim', () => {
    it('keeps the bucket containing a mid-hour minHeight', () => {
      const minHeight = START + 5 * HOUR + 30 * UnixTime.MINUTE

      expect(getEigenDaTrimRange([START, minHeight - 1], minHeight)).toEqual([
        START,
        START + 5 * HOUR - 1,
      ])
    })

    it('deletes every bucket before an hour aligned minHeight', () => {
      const minHeight = START + 5 * HOUR

      expect(getEigenDaTrimRange([START, minHeight - 1], minHeight)).toEqual([
        START,
        minHeight - 1,
      ])
    })

    it('returns an empty range when the trim stays within one bucket', () => {
      const minHeight = START + 30 * UnixTime.MINUTE

      const [from, to] = getEigenDaTrimRange([START, minHeight - 1], minHeight)
      expect(to < from).toEqual(true)
    })
  })

  describe('tail trim', () => {
    it('keeps the bucket containing a mid-hour maxHeight', () => {
      const minHeight = START
      const maxHeight = START + 5 * HOUR + 30 * UnixTime.MINUTE
      const currentHeight = START + 20 * HOUR

      // records are hour aligned, so the bucket containing maxHeight
      // (START + 5 * HOUR) is already below the range
      expect(
        getEigenDaTrimRange([maxHeight + 1, currentHeight], minHeight),
      ).toEqual([maxHeight + 1, currentHeight])
    })

    it('keeps the bucket starting exactly at maxHeight', () => {
      const minHeight = START
      const maxHeight = START + 5 * HOUR
      const currentHeight = START + 20 * HOUR

      expect(
        getEigenDaTrimRange([maxHeight + 1, currentHeight], minHeight),
      ).toEqual([maxHeight + 1, currentHeight])
    })

    it('is not clamped to the bucket of a mid-hour minHeight', () => {
      const minHeight = START + 30 * UnixTime.MINUTE
      const maxHeight = START + 5 * HOUR
      const currentHeight = START + 20 * HOUR

      expect(
        getEigenDaTrimRange([maxHeight + 1, currentHeight], minHeight),
      ).toEqual([maxHeight + 1, currentHeight])
    })
  })
})
