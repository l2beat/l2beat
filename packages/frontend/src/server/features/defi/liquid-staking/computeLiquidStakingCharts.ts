import type { ProjectLiquidStakingContracts } from '@l2beat/config'
import type {
  EthereumStakingDailyRecord,
  LiquidStakingSnapshotRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import type {
  LiquidStakingChartPoint,
  LiquidStakingCharts,
} from './getLiquidStakingCharts'

/** Yields and the network line are measured over this many days. */
export const YIELD_WINDOW_DAYS = 30
/** The market discount is a median over this many days, to smooth out spikes. */
export const DISCOUNT_WINDOW_DAYS = 7

export interface LiquidStakingChartProject {
  id: string
  type: ProjectLiquidStakingContracts['type']
  priceId: string
}

export interface LiquidStakingChartInputs {
  /** The chart's days, oldest first. */
  days: UnixTime[]
  projects: LiquidStakingChartProject[]
  /** Hourly, oldest first, from YIELD_WINDOW_DAYS before the first day. */
  snapshots: LiquidStakingSnapshotRecord[]
  /** Daily, oldest first, from YIELD_WINDOW_DAYS before the first day. */
  network: EthereumStakingDailyRecord[]
  /** USD price by price id, then by day. */
  prices: Map<string, Map<number, number>>
}

const DAY = UnixTime.DAY
const YEAR_OVER_WINDOW = 365 / YIELD_WINDOW_DAYS

export function computeLiquidStakingCharts(
  inputs: LiquidStakingChartInputs,
): LiquidStakingCharts {
  const byProject = new Map(
    inputs.projects.map((project) => [
      project.id,
      new ProjectSeries(
        project,
        inputs.snapshots.filter((s) => s.projectId === project.id),
        inputs.prices,
      ),
    ]),
  )
  const network = new NetworkSeries(inputs.network)

  return {
    yield: inputs.days.map((day) => ({
      timestamp: day,
      projects: perProject(inputs.projects, (p) =>
        byProject.get(p.id)?.yieldAt(day),
      ),
      network: network.yieldAt(day),
      ethStaked: network.ethStakedAt(day),
    })),
    costOfExit: inputs.days.map(
      (day): LiquidStakingChartPoint => ({
        timestamp: day,
        projects: perProject(inputs.projects, (p) =>
          byProject.get(p.id)?.costOfExitAt(day),
        ),
      }),
    ),
  }
}

class ProjectSeries {
  private readonly byTimestamp: Map<number, LiquidStakingSnapshotRecord>
  /** Request day → the request-weighted wait of its requests, in days. */
  private readonly queueWaitDays: Map<number, number>

  constructor(
    private readonly project: LiquidStakingChartProject,
    snapshots: LiquidStakingSnapshotRecord[],
    private readonly prices: Map<string, Map<number, number>>,
  ) {
    this.byTimestamp = new Map(snapshots.map((s) => [s.timestamp, s]))
    this.queueWaitDays = averageWaitByDay(getQueueWaits(snapshots))
  }

  /** Annualised change of the exchange rate over the window, not compounded. */
  yieldAt(day: number): number | null {
    const now = this.rateAt(day)
    const before = this.rateAt(day - YIELD_WINDOW_DAYS * DAY)
    if (now === undefined || before === undefined) return null
    return (now / before - 1) * YEAR_OVER_WINDOW
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
    const annualYield = this.yieldAt(day)
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
    const rate = this.rateAt(day)
    const tokenUsd = this.prices.get(this.project.priceId)?.get(day)
    const ethUsd = this.prices.get('ethereum')?.get(day)
    if (rate === undefined || tokenUsd === undefined || !ethUsd) return
    return 1 - tokenUsd / (rate * ethUsd)
  }

  private rateAt(timestamp: number): number | undefined {
    const snapshot = this.byTimestamp.get(timestamp)
    return snapshot && toEth(snapshot.exchangeRate)
  }
}

/**
 * For each hour that added requests, how long until its last request was
 * finalized. Both counters only grow, so one pass finds every answer.
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
    const requests = current.lastRequestId - previous
    if (requests <= 0) continue

    finalizedAt = Math.max(finalizedAt, i)
    while (
      finalizedAt < snapshots.length &&
      (snapshots[finalizedAt]?.lastFinalizedRequestId ?? -1) <
        current.lastRequestId
    ) {
      finalizedAt++
    }
    const finalized = snapshots[finalizedAt]
    // Requests still queued have no wait yet; later hours queue behind them.
    if (finalized === undefined) break
    waits.push({
      timestamp: current.timestamp,
      requests,
      hours: (finalized.timestamp - current.timestamp) / UnixTime.HOUR,
    })
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
    return toEth(consensus + start.executionRewards)
  }
}

function perProject(
  projects: LiquidStakingChartProject[],
  value: (project: LiquidStakingChartProject) => number | null | undefined,
): Record<string, number | null> {
  return Object.fromEntries(projects.map((p) => [p.id, value(p) ?? null]))
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
