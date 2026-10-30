import type { ProjectLiquidStakingContracts } from '@l2beat/config'
import type {
  EthereumStakingDailyRecord,
  LiquidStakingSnapshotRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import type {
  LiquidStakingChartPoint,
  LiquidStakingYieldPoint,
} from './getLiquidStakingCharts'

/** Yields and the network line are measured over this many days. */
export const YIELD_WINDOW_DAYS = 30
/** The market discount is a median over this many days, to smooth out spikes. */
const DISCOUNT_WINDOW_DAYS = 7

export interface LiquidStakingChartToken {
  id: string
  type: ProjectLiquidStakingContracts['type']
  priceId: string
}

export interface YieldChartInputs {
  /** The chart's days, oldest first. */
  days: UnixTime[]
  projectIds: string[]
  /** The snapshots that start a day, from YIELD_WINDOW_DAYS before the first. */
  snapshots: LiquidStakingSnapshotRecord[]
  /** Daily, oldest first, from YIELD_WINDOW_DAYS before the first day. */
  network: EthereumStakingDailyRecord[]
}

export interface CostOfExitChartInputs {
  /** The chart's days, oldest first. */
  days: UnixTime[]
  projects: LiquidStakingChartToken[]
  /** Hourly, oldest first, from YIELD_WINDOW_DAYS before the first day. */
  snapshots: LiquidStakingSnapshotRecord[]
  /** USD price by price id, then by day. */
  prices: Map<string, Map<number, number>>
}

const DAY = UnixTime.DAY
const YEAR_OVER_WINDOW = 365 / YIELD_WINDOW_DAYS

export function computeYieldChart(
  inputs: YieldChartInputs,
): LiquidStakingYieldPoint[] {
  const rates = new Map(
    inputs.projectIds.map((id) => [
      id,
      new ExchangeRates(inputs.snapshots.filter((s) => s.projectId === id)),
    ]),
  )
  const network = new NetworkSeries(inputs.network)

  return inputs.days.map((day) => ({
    timestamp: day,
    projects: Object.fromEntries(
      inputs.projectIds.map((id) => [id, rates.get(id)?.yieldAt(day) ?? null]),
    ),
    network: network.yieldAt(day),
    ethStaked: network.ethStakedAt(day),
  }))
}

export function computeCostOfExitChart(
  inputs: CostOfExitChartInputs,
): LiquidStakingChartPoint[] {
  const byProject = new Map(
    inputs.projects.map((project) => [
      project.id,
      new ExitCostSeries(
        project,
        inputs.snapshots.filter((s) => s.projectId === project.id),
        inputs.prices,
      ),
    ]),
  )

  return inputs.days.map((day) => ({
    timestamp: day,
    projects: Object.fromEntries(
      inputs.projects.map((p) => [
        p.id,
        byProject.get(p.id)?.costOfExitAt(day) ?? null,
      ]),
    ),
  }))
}

/** A token's exchange rate, by snapshot time. */
class ExchangeRates {
  private readonly byTimestamp: Map<number, bigint>

  constructor(snapshots: LiquidStakingSnapshotRecord[]) {
    this.byTimestamp = new Map(
      snapshots.map((s) => [s.timestamp, s.exchangeRate]),
    )
  }

  /** Annualised change of the exchange rate over the window, not compounded. */
  yieldAt(day: number): number | null {
    const now = this.at(day)
    const before = this.at(day - YIELD_WINDOW_DAYS * DAY)
    if (now === undefined || before === undefined) return null
    return (now / before - 1) * YEAR_OVER_WINDOW
  }

  /** ETH per token. */
  at(timestamp: number): number | undefined {
    const rate = this.byTimestamp.get(timestamp)
    // A zero rate is a bad read, and would divide the yield by zero.
    return rate !== undefined && rate > 0n ? toEth(rate) : undefined
  }
}

class ExitCostSeries {
  private readonly rates: ExchangeRates
  private readonly byTimestamp: Map<number, LiquidStakingSnapshotRecord>
  /** Request day → the request-weighted wait of its requests, in days. */
  private readonly queueWaitDays: Map<number, number>

  constructor(
    private readonly project: LiquidStakingChartToken,
    snapshots: LiquidStakingSnapshotRecord[],
    private readonly prices: Map<string, Map<number, number>>,
  ) {
    this.rates = new ExchangeRates(snapshots)
    this.byTimestamp = new Map(snapshots.map((s) => [s.timestamp, s]))
    this.queueWaitDays = averageWaitByDay(getQueueWaits(snapshots))
  }

  /** Days of yield an exit costs, by the cheaper of the queue and the market. */
  costOfExitAt(day: number): number | null {
    const routes = [this.queueDaysAt(day), this.marketDaysAt(day)].filter(
      (days): days is number => days !== null,
    )
    return routes.length > 0 ? Math.min(...routes) : null
  }

  /** A queued exit earns nothing while it waits, so it costs the wait. */
  private queueDaysAt(day: number): number | null {
    switch (this.project.type) {
      case 'lido':
      case 'etherfi':
        return this.queueWaitDays.get(day) ?? null
      case 'rocketpool': {
        // Burning rETH pays out at once while the buffer has ETH.
        const buffer = this.byTimestamp.get(day)?.instantExitEth
        return buffer ? 0 : null
      }
      case 'wbeth': {
        const lockTime = this.byTimestamp.get(day)?.lockTime
        return lockTime != null ? lockTime / DAY : null
      }
    }
  }

  /** Selling at a discount costs the days of yield the discount equals. */
  private marketDaysAt(day: number): number | null {
    const annualYield = this.rates.yieldAt(day)
    if (annualYield === null || annualYield <= 0) return null

    const discounts: number[] = []
    for (let i = 0; i < DISCOUNT_WINDOW_DAYS; i++) {
      const discount = this.discountAt(day - i * DAY)
      if (discount !== undefined) discounts.push(discount)
    }
    const discount = median(discounts)
    if (discount === undefined) return null
    // A token at a premium exits for free.
    return (Math.max(0, discount) * 365) / annualYield
  }

  /** How far below its ETH backing the token trades. */
  private discountAt(day: number): number | undefined {
    const rate = this.rates.at(day)
    const tokenUsd = this.prices.get(this.project.priceId)?.get(day)
    const ethUsd = this.prices.get('ethereum')?.get(day)
    if (rate === undefined || tokenUsd === undefined || !ethUsd) return
    return 1 - tokenUsd / (rate * ethUsd)
  }
}

/**
 * Split each hour's requests by when they finalized. Both counters only
 * grow, so one pass finds every completed portion's wait.
 */
export function getQueueWaits(
  snapshots: Pick<
    LiquidStakingSnapshotRecord,
    'timestamp' | 'lastRequestId' | 'lastFinalizedRequestId'
  >[],
): { timestamp: number; requests: number; hours: number }[] {
  const waits: { timestamp: number; requests: number; hours: number }[] = []
  let finalizedAt = 0
  for (let i = 1; i < snapshots.length; i++) {
    const previous = snapshots[i - 1]?.lastRequestId
    const current = snapshots[i]
    if (previous == null || current?.lastRequestId == null) continue
    finalizedAt = Math.max(finalizedAt, i)
    let requestId = previous
    while (requestId < current.lastRequestId) {
      const finalized = snapshots[finalizedAt]
      // Requests still queued have no wait yet; later hours queue behind them.
      if (finalized === undefined) return waits
      const last = Math.min(
        finalized.lastFinalizedRequestId ?? -1,
        current.lastRequestId,
      )
      if (last > requestId) {
        waits.push({
          timestamp: current.timestamp,
          requests: last - requestId,
          hours: (finalized.timestamp - current.timestamp) / UnixTime.HOUR,
        })
        requestId = last
      }
      if (requestId < current.lastRequestId) finalizedAt++
    }
  }
  return waits
}

/**
 * The request-weighted wait of each day's requests, in days. Requests made in
 * the hour before a snapshot belong to that hour, so midnight closes a day.
 */
function averageWaitByDay(
  waits: { timestamp: number; requests: number; hours: number }[],
): Map<number, number> {
  const totals = new Map<number, { requests: number; hours: number }>()
  for (const wait of waits) {
    const day = UnixTime.toStartOf(UnixTime(wait.timestamp - 1), 'day')
    const total = totals.get(day) ?? { requests: 0, hours: 0 }
    total.requests += wait.requests
    total.hours += wait.requests * wait.hours
    totals.set(day, total)
  }
  return new Map(
    [...totals].map(([day, t]) => [day, t.hours / t.requests / 24]),
  )
}

class NetworkSeries {
  private readonly byTimestamp: Map<number, EthereumStakingDailyRecord>

  constructor(days: EthereumStakingDailyRecord[]) {
    this.byTimestamp = new Map(days.map((d) => [d.timestamp, d]))
  }

  ethStakedAt(day: number): number | null {
    const record = this.byTimestamp.get(day)
    return record ? toEth(record.activeBalance) : null
  }

  /**
   * What all validators earned over the window, before protocol fees,
   * annualised over the stake. Days missing a row leave it empty.
   */
  yieldAt(day: number): number | null {
    let rewards = 0
    let stake = 0
    for (let i = YIELD_WINDOW_DAYS; i > 0; i--) {
      const reward = this.rewardsOn(day - i * DAY)
      const record = this.byTimestamp.get(day - i * DAY)
      if (reward === undefined || record === undefined) return null
      rewards += reward
      stake += toEth(record.activeBalance)
    }
    return (rewards / (stake / YIELD_WINDOW_DAYS)) * YEAR_OVER_WINDOW
  }

  /**
   * Consensus rewards are the balance change without the ETH that moved in
   * or out; execution rewards are counted directly.
   */
  private rewardsOn(day: number): number | undefined {
    const start = this.byTimestamp.get(day)
    const end = this.byTimestamp.get(day + DAY)
    if (!start || !end) return undefined
    // A credited deposit sits in a balance or, from Electra, the pending
    // queue, so counting both keeps it out of the rewards.
    const held = (r: EthereumStakingDailyRecord) =>
      r.totalBalance + (r.pendingDeposits ?? 0n)
    const consensus =
      held(end) - held(start) + start.withdrawals - start.deposits
    const execution =
      start.builderPayments + start.priorityFees + start.directTransfers
    return toEth(consensus + execution)
  }
}

function median(values: number[]): number | undefined {
  if (values.length === 0) return undefined
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 1
    ? sorted[middle]
    : ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2
}

/** Wei, or an 18-decimal rate, as a number of ETH. */
function toEth(value: bigint): number {
  return Number(value / 10n ** 9n) / 1e9
}
