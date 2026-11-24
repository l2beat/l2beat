import type { EthereumStakingDailyRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { buildSupplyDays, getDailyIssuance } from './computeEthSupply'

const DAY = UnixTime.DAY
const ETH = 10n ** 18n
const START = UnixTime.fromDate(new Date('2025-01-01T00:00:00Z'))

describe(getDailyIssuance.name, () => {
  it('counts the change in held ETH less what moved in or out', () => {
    const issuance = getDailyIssuance([
      record(0, { totalBalance: 1_000, withdrawals: 30, deposits: 50 }),
      // 100 more in balances, 20 more pending, 30 paid out, 50 paid in
      record(1, { totalBalance: 1_100, pendingDeposits: 20 }),
    ])

    expect([...issuance]).toEqual([[START, 100]])
  })

  it('leaves out a day without the next day', () => {
    const issuance = getDailyIssuance([
      record(0, { totalBalance: 1_000 }),
      record(2, { totalBalance: 1_100 }),
    ])

    expect(issuance.size).toEqual(0)
  })
})

describe(buildSupplyDays.name, () => {
  it('walks the supply out from the anchor', () => {
    const days = buildSupplyDays({
      issuance: byDay([10, 10, 10]),
      burn: byDay([4, 2, 1]),
      ethPrices: new Map([[START, 3_000]]),
      anchor: { timestamp: START + DAY, totalSupply: 1_000 },
    })

    expect(days).toEqual([
      {
        timestamp: START,
        totalSupply: 992,
        issuance: 10,
        burn: 4,
        ethPriceUsd: 3_000,
      },
      {
        timestamp: START + DAY,
        totalSupply: 1_000,
        issuance: 10,
        burn: 2,
        ethPriceUsd: null,
      },
      {
        timestamp: START + 2 * DAY,
        totalSupply: 1_009,
        issuance: 10,
        burn: 1,
        ethPriceUsd: null,
      },
    ])
  })

  it('ends at a day without issuance or burn', () => {
    const days = buildSupplyDays({
      issuance: byDay([10, 10, 10, 10]),
      burn: new Map([
        [START, 1],
        [START + 2 * DAY, 1],
        [START + 3 * DAY, 1],
      ]),
      ethPrices: new Map(),
      anchor: { timestamp: START + 2 * DAY, totalSupply: 1_000 },
    })

    expect(days.map((d) => d.timestamp)).toEqual([
      START + 2 * DAY,
      START + 3 * DAY,
    ])
  })

  it('throws without the anchor day', () => {
    expect(() =>
      buildSupplyDays({
        issuance: byDay([10]),
        burn: byDay([1]),
        ethPrices: new Map(),
        anchor: { timestamp: START + DAY, totalSupply: 1_000 },
      }),
    ).toThrow('Supply anchor not covered')
  })
})

function record(
  dayIndex: number,
  eth: {
    totalBalance: number
    pendingDeposits?: number
    withdrawals?: number
    deposits?: number
  },
): EthereumStakingDailyRecord {
  const wei = (value = 0) => BigInt(value) * ETH
  return {
    timestamp: UnixTime(START + dayIndex * DAY),
    slot: 0,
    totalBalance: wei(eth.totalBalance),
    activeBalance: 0n,
    pendingDeposits:
      eth.pendingDeposits === undefined ? null : wei(eth.pendingDeposits),
    withdrawals: wei(eth.withdrawals),
    deposits: wei(eth.deposits),
    builderPayments: 0n,
    priorityFees: 0n,
    directTransfers: 0n,
    blockCount: 0,
    builderBlockCount: 0,
  }
}

function byDay(values: number[]) {
  return new Map(values.map((value, i) => [START + i * DAY, value]))
}
