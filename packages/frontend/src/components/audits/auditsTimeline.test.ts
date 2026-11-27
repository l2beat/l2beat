import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  formatDuration,
  getLabeledTicks,
  getMonthTicks,
  getTimeScale,
  getTimeTicks,
  getYearTicks,
} from './auditsTimeline'

const utc = (year: number, month = 0, day = 1) =>
  Date.UTC(year, month, day) / 1000

describe('auditsTimeline', () => {
  describe(getYearTicks.name, () => {
    it('lists the new years strictly inside the range', () => {
      const ticks = getYearTicks(utc(2022) + 100, utc(2025))
      expect(ticks.map((t) => t.label)).toEqual(['2023', '2024'])
      expect(ticks[0]?.timestamp).toEqual(utc(2023))
    })

    it('is empty within a year', () => {
      expect(getYearTicks(utc(2022) + 1, utc(2023) - 1)).toEqual([])
    })
  })

  describe(getMonthTicks.name, () => {
    it('lists the first days of months with a year suffix', () => {
      const ticks = getMonthTicks(utc(2025, 10, 15), utc(2026, 1, 10))
      expect(ticks.map((t) => t.label)).toEqual([
        "Dec '25",
        "Jan '26",
        "Feb '26",
      ])
      expect(ticks.map((t) => t.ordinal)).toEqual([
        2025 * 12 + 11,
        2026 * 12,
        2026 * 12 + 1,
      ])
    })
  })

  describe(getTimeTicks.name, () => {
    it('uses years over long ranges and months over short ones', () => {
      expect(getTimeTicks(utc(2020), utc(2026)).length).toEqual(5)
      expect(
        getTimeTicks(utc(2025, 3), utc(2026, 3)).map((t) => t.label),
      ).toEqual(getMonthTicks(utc(2025, 3), utc(2026, 3)).map((t) => t.label))
    })
  })

  describe(getLabeledTicks.name, () => {
    const ticks = getYearTicks(utc(2020), utc(2026))
    const toX = getTimeScale(utc(2020), utc(2026), 0, 120)

    it('labels every tick when they fit', () => {
      expect(getLabeledTicks(ticks, toX, 18)).toEqual(
        new Set([2021, 2022, 2023, 2024, 2025]),
      )
    })

    it('labels even years when every other fits', () => {
      expect(getLabeledTicks(ticks, toX, 30)).toEqual(new Set([2022, 2024]))
    })

    it('labels a single tick', () => {
      expect(getLabeledTicks(ticks.slice(0, 1), toX, 100)).toEqual(
        new Set([2021]),
      )
    })
  })

  describe(formatDuration.name, () => {
    it('rounds to readable units', () => {
      expect(formatDuration(3 * UnixTime.DAY)).toEqual('3d')
      expect(formatDuration(45 * UnixTime.DAY)).toEqual('1mo')
      expect(formatDuration(365 * UnixTime.DAY)).toEqual('1y')
      expect(formatDuration(500 * UnixTime.DAY)).toEqual('1y 4mo')
    })
  })
})
