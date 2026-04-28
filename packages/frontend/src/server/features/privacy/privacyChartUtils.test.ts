import type { ProjectId } from '@l2beat/shared-pure'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { PrivacyBucketRow } from './db/PrivacyBucketRepo'
import type {
  PrivacyHistoryCursor,
  PrivacyHistoryDayRow,
} from './db/PrivacyHistoryRepo'
import { buildPrivacyChart, buildPrivacyTvlChart } from './privacyChartUtils'
import { amountToUsd, getPrivacyTokenInfo } from './privacyUtils'
import type { PrivacyProjectConfig } from './types'

const ETH_PRICE = getPrivacyTokenInfo(undefined, 'ETH').price

describe('buildPrivacyChart', () => {
  const oneEth = '1000000000000000000'
  const twoEth = '2000000000000000000'
  const threeEth = '3000000000000000000'
  const fourEth = '4000000000000000000'

  it('aggregates rows across projects, zero-fills missing days, and uses the minimum syncedUntil', () => {
    const day1 = UnixTime(100 * UnixTime.DAY)
    const day2 = UnixTime(day1 + UnixTime.DAY)
    const day3 = UnixTime(day2 + UnixTime.DAY)

    const result = buildPrivacyChart(
      [project('alpha'), project('beta')],
      [
        row({
          projectId: 'alpha',
          timestamp: day1,
          depositCount: 2,
          withdrawalCount: 1,
          depositAmount: twoEth,
          withdrawalAmount: oneEth,
        }),
        row({
          projectId: 'beta',
          timestamp: day1,
          depositCount: 3,
          withdrawalCount: 4,
          depositAmount: oneEth,
          withdrawalAmount: twoEth,
        }),
        row({
          projectId: 'alpha',
          timestamp: day3,
          depositCount: 1,
          withdrawalCount: 2,
          depositAmount: oneEth,
          withdrawalAmount: threeEth,
        }),
        row({
          projectId: 'ignored',
          timestamp: day1,
          depositCount: 999,
          withdrawalCount: 999,
          depositAmount: fourEth,
          withdrawalAmount: fourEth,
        }),
      ],
      [
        cursor({
          key: 'alpha::eth::main::deposit',
          syncedAt: day3 + 12 * UnixTime.HOUR,
        }),
        cursor({
          key: 'beta::eth::main::deposit',
          syncedAt: day2 + 6 * UnixTime.HOUR,
        }),
        cursor({
          key: 'ignored::eth::main::deposit',
          syncedAt: day1,
        }),
      ],
      [day1, day3],
    )

    expect(result).toEqual({
      chart: [
        [
          day1,
          5,
          5,
          amountToUsd(BigInt(threeEth), 18, ETH_PRICE),
          amountToUsd(BigInt(threeEth), 18, ETH_PRICE),
        ],
        [day2, 0, 0, 0, 0],
        [
          day3,
          1,
          2,
          amountToUsd(BigInt(oneEth), 18, ETH_PRICE),
          amountToUsd(BigInt(threeEth), 18, ETH_PRICE),
        ],
      ],
      syncedUntil: UnixTime.toStartOf(day2 + 6 * UnixTime.HOUR, 'day'),
    })
  })

  it('starts MAX from the earliest tracked history row', () => {
    const day1 = UnixTime(200 * UnixTime.DAY)
    const day2 = UnixTime(day1 + UnixTime.DAY)
    const day3 = UnixTime(day2 + UnixTime.DAY)

    const result = buildPrivacyChart(
      [project('alpha'), project('beta')],
      [
        row({
          projectId: 'beta',
          timestamp: day2,
          depositCount: 2,
          depositAmount: twoEth,
        }),
        row({
          projectId: 'alpha',
          timestamp: day1,
          depositCount: 1,
          depositAmount: oneEth,
        }),
      ],
      [
        cursor({
          key: 'alpha::eth::main::deposit',
          syncedAt: day3,
        }),
      ],
      [null, day3],
    )

    expect(result.chart).toEqual([
      [day1, 1, 0, amountToUsd(BigInt(oneEth), 18, ETH_PRICE), 0],
      [day2, 2, 0, amountToUsd(BigInt(twoEth), 18, ETH_PRICE), 0],
      [day3, 0, 0, 0, 0],
    ])
  })

  it('builds TVL by anchoring to the current snapshot and rolling flows backwards', () => {
    const day1 = UnixTime(300 * UnixTime.DAY)
    const day2 = UnixTime(day1 + UnixTime.DAY)
    const day3 = UnixTime(day2 + UnixTime.DAY)

    const result = buildPrivacyTvlChart(
      [project('alpha'), project('beta')],
      [
        row({
          projectId: 'alpha',
          timestamp: day1,
          depositAmount: oneEth,
          withdrawalAmount: '0',
        }),
        row({
          projectId: 'beta',
          timestamp: day2,
          depositAmount: '0',
          withdrawalAmount: twoEth,
        }),
      ],
      [
        cursor({
          key: 'alpha::eth::main::deposit',
          syncedAt: day3 + 6 * UnixTime.HOUR,
        }),
      ],
      [
        snapshotRow({
          projectId: 'alpha',
          totalValueUsd: amountToUsd(BigInt(twoEth), 18, ETH_PRICE),
          timestamp: day3 + 10,
        }),
        snapshotRow({
          projectId: 'beta',
          totalValueUsd: amountToUsd(BigInt(oneEth), 18, ETH_PRICE),
          timestamp: day3 + 20,
        }),
      ],
      [day1, day3],
    )

    expect(result).toEqual({
      chart: [
        [day1, amountToUsd(BigInt('5000000000000000000'), 18, ETH_PRICE)],
        [day2, amountToUsd(BigInt(threeEth), 18, ETH_PRICE)],
        [day3, amountToUsd(BigInt(threeEth), 18, ETH_PRICE)],
      ],
      syncedUntil: day3,
    })
  })
})

function project(id: string): PrivacyProjectConfig {
  return {
    id: id as ProjectId,
    slug: id,
    name: id,
    shortName: undefined,
    addedAt: UnixTime(0),
    display: {} as PrivacyProjectConfig['display'],
    statuses: {} as PrivacyProjectConfig['statuses'],
    privacyInfo: {
      trustedSetup: {} as PrivacyProjectConfig['privacyInfo']['trustedSetup'],
      assets: [
        {
          asset: { symbol: 'ETH' },
          buckets: [{ id: 'main', label: 'Main', type: 'pool' }],
        },
      ],
    } as PrivacyProjectConfig['privacyInfo'],
  } as PrivacyProjectConfig
}

function row(overrides: Partial<PrivacyHistoryDayRow>): PrivacyHistoryDayRow {
  return {
    projectId: 'alpha',
    assetKey: 'eth',
    bucketId: 'main',
    timestamp: 0,
    depositCount: 0,
    withdrawalCount: 0,
    depositAmount: '0',
    withdrawalAmount: '0',
    ...overrides,
  }
}

function cursor(
  overrides: Partial<PrivacyHistoryCursor>,
): PrivacyHistoryCursor {
  return {
    key: 'alpha::eth::main::deposit',
    lastSyncedBlock: 0,
    syncedAt: 0,
    ...overrides,
  }
}

function snapshotRow(overrides: Partial<PrivacyBucketRow>): PrivacyBucketRow {
  return {
    projectId: 'alpha',
    assetKey: 'eth',
    bucketId: 'main',
    timestamp: 0,
    totalValueAmount: null,
    priceUsd: ETH_PRICE,
    totalValueUsd: 0,
    depositsTotal: 0,
    deposits7d: 0,
    deposits30d: 0,
    ...overrides,
  }
}
