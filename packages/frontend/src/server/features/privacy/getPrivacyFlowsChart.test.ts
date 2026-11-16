import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getPrivacyFlowsChartWindow } from './getPrivacyFlowsChart'

// rangeToResolution reads the real clock, so the ranges are anchored to today.
const DAY = UnixTime.toStartOf(UnixTime.now(), 'day')
const NOW = DAY + 10 * UnixTime.HOUR + 10 * UnixTime.MINUTE

describe(getPrivacyFlowsChartWindow.name, () => {
  it('charts complete hours up to the furthest indexed height', () => {
    const result = getPrivacyFlowsChartWindow(
      [DAY - 7 * UnixTime.DAY, DAY + 8 * UnixTime.HOUR],
      { reached: DAY + 9 * UnixTime.HOUR, slowest: DAY + 9 * UnixTime.HOUR },
      NOW,
    )

    expect(result).toEqual({
      resolution: 'hour',
      from: DAY - 7 * UnixTime.DAY,
      to: DAY + 9 * UnixTime.HOUR,
      syncedUntil: DAY + 8 * UnixTime.HOUR,
    })
  })

  it('marks the last period the slowest configuration completed', () => {
    const result = getPrivacyFlowsChartWindow(
      [DAY - 30 * UnixTime.DAY, NOW],
      { reached: DAY + 9 * UnixTime.HOUR, slowest: DAY + 7 * UnixTime.HOUR },
      NOW,
    )

    expect(result).toEqual({
      resolution: 'six hours',
      from: DAY - 30 * UnixTime.DAY,
      to: DAY + 6 * UnixTime.HOUR,
      syncedUntil: DAY,
    })
  })

  it('shows complete days only on long ranges', () => {
    const result = getPrivacyFlowsChartWindow(
      [null, NOW],
      { reached: DAY + 9 * UnixTime.HOUR, slowest: DAY + 9 * UnixTime.HOUR },
      NOW,
    )

    expect(result).toEqual({
      resolution: 'day',
      from: null,
      to: DAY,
      syncedUntil: DAY - UnixTime.DAY,
    })
  })

  it('keeps the end of a range that stops before the indexed height', () => {
    const end = DAY - 2 * UnixTime.DAY
    const result = getPrivacyFlowsChartWindow(
      [DAY - 7 * UnixTime.DAY, end + 23 * UnixTime.HOUR + 59 * UnixTime.MINUTE],
      { reached: DAY + 9 * UnixTime.HOUR, slowest: DAY + 9 * UnixTime.HOUR },
      NOW,
    )

    expect(result.to).toEqual(end + UnixTime.DAY)
  })

  it('falls back to the current time without indexer heights', () => {
    const result = getPrivacyFlowsChartWindow(
      [DAY - 7 * UnixTime.DAY, NOW],
      undefined,
      NOW,
    )

    expect(result).toEqual({
      resolution: 'hour',
      from: DAY - 7 * UnixTime.DAY,
      to: DAY + 10 * UnixTime.HOUR,
      syncedUntil: undefined,
    })
  })
})
