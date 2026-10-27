import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { buildActivityProjectChartStats } from './buildActivityProjectChartStats'

describe(buildActivityProjectChartStats.name, () => {
  const SINCE = UnixTime(1_700_000_000)
  const maxCounts = {
    count: 4 * UnixTime.DAY,
    countTimestamp: 100,
    uopsCount: 5 * UnixTime.DAY,
    uopsTimestamp: 200,
  }

  it('builds TPS and UOPS stats with complete totals', () => {
    const result = buildActivityProjectChartStats({
      pastDayCount: 2 * UnixTime.DAY,
      pastDayUopsCount: 3 * UnixTime.DAY,
      sevenDaysAgoCount: UnixTime.DAY,
      sevenDaysAgoUopsCount: UnixTime.DAY,
      maxCounts,
      peaks: undefined,
      totals: {
        count: 100,
        uopsCount: 0,
        sinceTimestamp: SINCE,
        uopsSinceTimestamp: SINCE,
      },
    })

    expect(result).toEqual({
      tps: {
        pastDayCount: 2,
        pastDayChange: 1,
        pastDayChangePeriod: '7D',
        pastDaySum: 2 * UnixTime.DAY,
        maxCount: { value: 4, timestamp: 100 },
        peaks: undefined,
        totalCount: { value: 100, sinceTimestamp: SINCE },
      },
      uops: {
        pastDayCount: 3,
        pastDayChange: 2,
        pastDayChangePeriod: '7D',
        pastDaySum: 3 * UnixTime.DAY,
        maxCount: { value: 5, timestamp: 200 },
        peaks: undefined,
        totalCount: { value: 0, sinceTimestamp: SINCE },
      },
    })
  })

  it('omits the UOPS total when the history is incomplete', () => {
    const result = buildActivityProjectChartStats({
      pastDayCount: null,
      pastDayUopsCount: null,
      sevenDaysAgoCount: 0,
      sevenDaysAgoUopsCount: 0,
      maxCounts,
      peaks: undefined,
      totals: {
        count: 100,
        uopsCount: 150,
        sinceTimestamp: SINCE,
        uopsSinceTimestamp: SINCE + UnixTime.DAY,
      },
    })

    expect(result.uops.totalCount).toEqual(undefined)
    expect(result.tps.totalCount).toEqual({
      value: 100,
      sinceTimestamp: SINCE,
    })
  })

  it("averages the busiest hour and minute over their length, as the busiest day's is averaged over a day", () => {
    const DAY = UnixTime.DAY
    const result = buildActivityProjectChartStats({
      pastDayCount: null,
      pastDayUopsCount: null,
      sevenDaysAgoCount: 0,
      sevenDaysAgoUopsCount: 0,
      maxCounts,
      peaks: {
        since: SINCE,
        hour: {
          count: 6 * 3600,
          countTimestamp: SINCE + DAY,
          uopsCount: 8 * 3600,
          uopsTimestamp: SINCE + 2 * DAY,
        },
        minute: {
          count: 30 * 60,
          countTimestamp: SINCE + 3 * DAY,
          uopsCount: 40 * 60,
          uopsTimestamp: SINCE + 4 * DAY,
        },
      },
      totals: undefined,
    })

    expect(result.tps.peaks).toEqual({
      sinceTimestamp: SINCE,
      hour: { value: 6, timestamp: SINCE + DAY },
      minute: { value: 30, timestamp: SINCE + 3 * DAY },
    })
    expect(result.uops.peaks).toEqual({
      sinceTimestamp: SINCE,
      hour: { value: 8, timestamp: SINCE + 2 * DAY },
      minute: { value: 40, timestamp: SINCE + 4 * DAY },
    })
  })
})
