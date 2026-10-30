import type {
  EthereumStakingDailyRecord,
  LiquidStakingSnapshotRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  computeCostOfExitChart,
  computeYieldChart,
  getQueueWaits,
  type LiquidStakingChartToken,
} from './computeLiquidStakingCharts'

const DAY = UnixTime.DAY
const HOUR = UnixTime.HOUR
const ETH = 10n ** 18n
const START = UnixTime.fromDate(new Date('2025-01-01T00:00:00Z'))
const DAY_31 = START + 31 * DAY

describe(computeYieldChart.name, () => {
  it('annualises the 30-day rate change without compounding', () => {
    const charts = compute(
      [project('lido')],
      [snapshot('lido', START + DAY, 1.0), snapshot('lido', DAY_31, 1.003)],
    )
    expect(present(charts.yield[0]?.projects.lido)).toBeCloseTo(
      0.003 * (365 / 30),
      1e-6,
    )
  })

  it('derives the network yield from balances, flows and execution rewards', () => {
    // After Electra: each day the balance grows by 10 ETH while 100 ETH
    // leaves and 50 ETH is deposited, so consensus rewards are 60 ETH;
    // proposers add 5 ETH.
    const network = Array.from({ length: 32 }, (_, i) =>
      day(START + i * DAY, 1_000_000n + 10n * BigInt(i), 0n),
    )
    const charts = compute([], [], network)
    const point = charts.yield[0]
    expect(present(point?.ethStaked)).toBeCloseTo(999_310, 1e-6)
    // 65 ETH a day over the average active stake of days 1 to 30, 999,155 ETH.
    expect(present(point?.network)).toBeCloseTo(
      ((65 * 30) / 999_155) * (365 / 30),
      1e-12,
    )
  })

  it('keeps balances moved into the pending queue at Electra out of the rewards', () => {
    // From day 10, 1,000 ETH of balances waits in the new queue instead.
    const network = Array.from({ length: 32 }, (_, i) =>
      i < 10
        ? day(START + i * DAY, 1_000_000n + 10n * BigInt(i), null)
        : day(START + i * DAY, 999_000n + 10n * BigInt(i), 1_000n),
    )
    // The 1,000 ETH left the active stake on 21 of the window's 30 days.
    expect(present(compute([], [], network).yield[0]?.network)).toBeCloseTo(
      ((65 * 30) / (999_155 - (1_000 * 21) / 30)) * (365 / 30),
      1e-12,
    )
  })
})

describe(computeCostOfExitChart.name, () => {
  it('takes the queue wait of the day’s requests, weighted by count', () => {
    // 2 requests in the hour to 01:00, 1 in the hour to 02:00; all three
    // finalized at 05:00, so they waited 4 and 3 hours.
    const charts = compute(
      [project('etherfi')],
      [
        snapshot('etherfi', START + DAY, 1),
        snapshot('etherfi', DAY_31, 1, {
          lastRequestId: 10,
          lastFinalizedRequestId: 10,
        }),
        snapshot('etherfi', DAY_31 + HOUR, 1, {
          lastRequestId: 12,
          lastFinalizedRequestId: 10,
        }),
        snapshot('etherfi', DAY_31 + 2 * HOUR, 1, {
          lastRequestId: 13,
          lastFinalizedRequestId: 10,
        }),
        snapshot('etherfi', DAY_31 + 5 * HOUR, 1, {
          lastRequestId: 13,
          lastFinalizedRequestId: 13,
        }),
      ],
    )
    // A flat rate leaves no market route, so this is the queue.
    expect(present(charts.costOfExit[0]?.projects.etherfi)).toBeCloseTo(
      (2 * 4 + 1 * 3) / 3 / 24,
      1e-6,
    )
  })

  it('weights requests from one hour by their separate finalizations', () => {
    const snapshots = [
      snapshot('etherfi', DAY_31, 1, {
        lastRequestId: 10,
        lastFinalizedRequestId: 10,
      }),
      snapshot('etherfi', DAY_31 + HOUR, 1, {
        lastRequestId: 12,
        lastFinalizedRequestId: 10,
      }),
      snapshot('etherfi', DAY_31 + 2 * HOUR, 1, {
        lastRequestId: 12,
        lastFinalizedRequestId: 11,
      }),
      snapshot('etherfi', DAY_31 + DAY + HOUR, 1, {
        lastRequestId: 12,
        lastFinalizedRequestId: 12,
      }),
    ]
    // The two requests waited 1 and 24 hours.
    const completed = compute([project('etherfi')], snapshots)
    expect(present(completed.costOfExit[0]?.projects.etherfi)).toBeCloseTo(
      (1 + 24) / 2 / 24,
      1e-6,
    )

    // While the second is still queued, it waits at the pace of the
    // finalizations so far: half a request an hour, with half a request
    // ahead of it, so one more hour after the hour it has waited.
    const partial = compute([project('etherfi')], snapshots.slice(0, -1))
    expect(present(partial.costOfExit[0]?.projects.etherfi)).toBeCloseTo(
      (1 + 2) / 2 / 24,
      1e-12,
    )
    expect(partial.costOfExit[0]?.estimated).toEqual(['etherfi'])
    expect(completed.costOfExit[0]?.estimated).toEqual([])
  })

  it('takes the market when it is cheaper than the queue', () => {
    const charts = compute(
      [project('wbeth')],
      [
        snapshot('wbeth', START + DAY, 1.0),
        // 100 tokens fetch 0.1% under what they're worth at the rate.
        snapshot('wbeth', DAY_31, 1.01, {
          lockTime: 40 * DAY,
          marketExitEth: (100_899n * ETH) / 1000n,
          marketExitValueEth: 101n * ETH,
        }),
      ],
    )
    const annualYield = 0.01 * (365 / 30)
    expect(present(charts.costOfExit[0]?.projects.wbeth)).toBeCloseTo(
      (0.001 * 365) / annualYield,
      1e-9,
    )
  })

  it('exits Rocket Pool at once only while its buffer holds the reference exit', () => {
    const at = (instantExitEth: bigint) =>
      compute(
        [project('rocketpool')],
        [
          snapshot('rocketpool', START + DAY, 1),
          snapshot('rocketpool', DAY_31, 1, {
            instantExitEth,
            instantExitFeeBps: 0,
          }),
        ],
      ).costOfExit[0]?.projects.rocketpool

    expect(at(100n * ETH)).toEqual(0)
    // Dust in the buffer pays out nothing worth counting.
    expect(at(ETH)).toEqual(null)
  })

  it('counts an instant redemption’s fee in days of yield', () => {
    const charts = compute(
      [project('etherfi')],
      [
        snapshot('etherfi', START + DAY, 1.0),
        snapshot('etherfi', DAY_31, 1.003, {
          instantExitEth: 500n * ETH,
          instantExitFeeBps: 30,
        }),
      ],
    )
    const annualYield = 0.003 * (365 / 30)
    expect(present(charts.costOfExit[0]?.projects.etherfi)).toBeCloseTo(
      (0.003 * 365) / annualYield,
      1e-9,
    )
  })

  it('makes wBETH unwraps wait at least the lock, even without requests', () => {
    const lockTime = 10 * DAY
    const quiet = compute(
      [project('wbeth')],
      [snapshot('wbeth', DAY_31, 1, { lockTime })],
    )
    expect(quiet.costOfExit[0]?.projects.wbeth).toEqual(10)

    // A request allocated ETH after an hour still waits out its lock.
    const allocated = compute(
      [project('wbeth')],
      [
        snapshot('wbeth', DAY_31, 1, {
          lockTime,
          lastRequestId: 5,
          lastFinalizedRequestId: 5,
        }),
        snapshot('wbeth', DAY_31 + HOUR, 1, {
          lockTime,
          lastRequestId: 6,
          lastFinalizedRequestId: 5,
        }),
        snapshot('wbeth', DAY_31 + 2 * HOUR, 1, {
          lockTime,
          lastRequestId: 6,
          lastFinalizedRequestId: 6,
        }),
      ],
    )
    expect(allocated.costOfExit[0]?.projects.wbeth).toEqual(10)
  })
})

describe(getQueueWaits.name, () => {
  it('estimates the requests still queued from the finalization pace', () => {
    expect(
      getQueueWaits([
        { timestamp: 0, lastRequestId: 1, lastFinalizedRequestId: 1 },
        { timestamp: HOUR, lastRequestId: 3, lastFinalizedRequestId: 1 },
        { timestamp: 2 * HOUR, lastRequestId: 5, lastFinalizedRequestId: 3 },
      ]),
    ).toEqual([
      { timestamp: HOUR, requests: 2, hours: 1, estimated: false },
      // One request finalized an hour; the middle of 3 to 5 is one ahead.
      { timestamp: 2 * HOUR, requests: 2, hours: 1, estimated: true },
    ])
  })

  it('counts the wait so far when nothing has finalized lately', () => {
    expect(
      getQueueWaits([
        { timestamp: 0, lastRequestId: 1, lastFinalizedRequestId: 1 },
        { timestamp: HOUR, lastRequestId: 2, lastFinalizedRequestId: 1 },
        { timestamp: 3 * HOUR, lastRequestId: 2, lastFinalizedRequestId: 1 },
      ]),
    ).toEqual([{ timestamp: HOUR, requests: 1, hours: 2, estimated: true }])
  })
})

function compute(
  projects: LiquidStakingChartToken[],
  snapshots: LiquidStakingSnapshotRecord[],
  network: EthereumStakingDailyRecord[] = [],
) {
  const days = [UnixTime(DAY_31)]
  return {
    yield: computeYieldChart({
      days,
      projectIds: projects.map((p) => p.id),
      snapshots,
      network,
    }),
    costOfExit: computeCostOfExitChart({ days, projects, snapshots }),
  }
}

function project(
  type: LiquidStakingChartToken['type'],
): LiquidStakingChartToken {
  return { id: type, type }
}

function snapshot(
  projectId: string,
  timestamp: number,
  rate: number,
  exit: Partial<LiquidStakingSnapshotRecord> = {},
): LiquidStakingSnapshotRecord {
  return {
    configurationId: projectId,
    projectId,
    timestamp: UnixTime(timestamp),
    blockNumber: 0,
    exchangeRate: BigInt(Math.round(rate * 1e9)) * 10n ** 9n,
    lastRequestId: null,
    lastFinalizedRequestId: null,
    instantExitEth: null,
    instantExitFeeBps: null,
    lockTime: null,
    marketExitEth: null,
    marketExitValueEth: null,
    ...exit,
  }
}

function day(
  timestamp: number,
  balanceEth: bigint,
  pendingEth: bigint | null = null,
): EthereumStakingDailyRecord {
  return {
    timestamp: UnixTime(timestamp),
    slot: 0,
    totalBalance: balanceEth * ETH,
    // 1,000 ETH of it waits to enter or has exited, and earns nothing.
    activeBalance: (balanceEth - 1_000n) * ETH,
    pendingDeposits: pendingEth === null ? null : pendingEth * ETH,
    withdrawals: 100n * ETH,
    deposits: 50n * ETH,
    builderPayments: 3n * ETH,
    priorityFees: ETH + ETH / 2n,
    directTransfers: ETH / 2n,
    blockCount: 7200,
    builderBlockCount: 6300,
  }
}

function present(value: number | null | undefined): number {
  if (value == null) throw new Error('Missing chart value')
  return value
}
