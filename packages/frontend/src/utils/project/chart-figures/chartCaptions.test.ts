import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { ProjectCostsChartResponse } from '~/server/features/layer2s/costs/getProjectCostsChart'
import {
  getActivityChartCaption,
  getCostsChartCaption,
  getDataPostedChartCaption,
  getLivenessChartCaption,
  getTvsChartCaption,
} from './chartCaptions'

// Each builder is fed a two-point series in the shape its chart endpoint
// returns, with hand-computed expected sentences, to prove that the right
// columns are summed and the right unit formatter is applied. Currency
// formatting separates the magnitude suffix with a hair space (\u200a).
const START = UnixTime.fromDate(new Date('2025-09-23T00:00:00Z'))
const END = UnixTime.fromDate(new Date('2026-09-22T00:00:00Z'))
const RANGE = 'from 2025 Sep 23 to 2026 Sep 22'

describe(getTvsChartCaption.name, () => {
  it('sums native, canonical and external value in USD', () => {
    const caption = getTvsChartCaption('Foo', [
      [START, 3000, 1e9, 2e9, 1e9, 0, 0, 0, 0, 0, 0],
      [END, 4000, 2e9, 2e9, 1e9, 0, 0, 0, 0, 0, 0],
    ])

    expect(caption).toEqual(
      `Total value secured by Foo in USD ${RANGE}. Latest value: $5.00\u200aB, up 25.0% over this range.`,
    )
  })
})

describe(getActivityChartCaption.name, () => {
  it('describes daily user operations as UOPS', () => {
    const caption = getActivityChartCaption('Foo', [
      [START, 86_400, 86_400 * 2],
      [END, 86_400, 86_400 * 3],
    ])

    expect(caption).toEqual(
      `Daily average user operations per second (UOPS) on Foo ${RANGE}. Latest value: 3.00 UOPS, up 50.0% over this range.`,
    )
  })

  it('falls back to transactions for days without a user operation count', () => {
    const caption = getActivityChartCaption('Foo', [
      [START, 86_400, null],
      [END, 86_400 * 2, null],
    ])

    expect(caption).toInclude(
      'Latest value: 2.00 UOPS, up 100% over this range.',
    )
  })
})

describe(getCostsChartCaption.name, () => {
  it('sums the USD cost components and states the total', () => {
    const caption = getCostsChartCaption('Foo', {
      chart: [
        costsPoint(START, {
          overhead: 100,
          calldata: 100,
          compute: 0,
          blobs: 0,
        }),
        costsPoint(END, {
          overhead: 100,
          calldata: 50,
          compute: 50,
          blobs: 100,
        }),
      ],
      hasBlobs: true,
      stats: {
        total: { gas: 0, eth: 0, usd: 12_345 },
        perL2Uop: undefined,
        perDay: { gas: 0, eth: 0, usd: 0 },
      },
      syncedUntil: END,
    })

    expect(caption).toEqual(
      `Daily onchain costs paid by Foo to Ethereum in USD ${RANGE}. Latest value: $300.00, up 50.0% over this range. Total over this range: $12.34\u200aK.`,
    )
  })
})

describe(getLivenessChartCaption.name, () => {
  it('describes the average interval of the given subtype', () => {
    const caption = getLivenessChartCaption('Foo', 'batchSubmissions', [
      [START, 60, 3600, 7200],
      [END, 60, 1800, 7200],
    ])

    expect(caption).toEqual(
      `Average interval between tx data submissions of Foo ${RANGE}. Latest value: 30 minutes, down 50.0% over this range.`,
    )
  })
})

describe(getDataPostedChartCaption.name, () => {
  it('sums data posted to every DA layer and states the total', () => {
    const caption = getDataPostedChartCaption('Foo', {
      chart: [
        [START, 1024, null, null, null],
        [END, 1024, 1024, null, null],
      ],
      syncedUntil: END,
      stats: { total: 1024 * 1024, avgPerDay: 0, postedPerUop: 0 },
    })

    expect(caption).toEqual(
      `Daily data posted by Foo to its DA layers ${RANGE}. Latest value: 2.00 KiB, up 100% over this range. Total over this range: 1.00 MiB.`,
    )
  })

  it('says there is no data when the chart is missing', () => {
    expect(getDataPostedChartCaption('Foo', null)).toEqual(
      'Daily data posted by Foo to its DA layers. No data is available for this range.',
    )
  })
})

function costsPoint(
  timestamp: number,
  usd: { overhead: number; calldata: number; compute: number; blobs: number },
): ProjectCostsChartResponse['chart'][number] {
  return [
    timestamp,
    0,
    0,
    usd.overhead,
    0,
    0,
    usd.calldata,
    0,
    0,
    usd.compute,
    0,
    0,
    usd.blobs,
    null,
    null,
    null,
    null,
  ]
}
