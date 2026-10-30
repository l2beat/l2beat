import type { ProjectLiquidStakingContracts } from '@l2beat/config'
import type {
  EthereumStakingDailyRecord,
  LiquidStakingSnapshotRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import type {
  LiquidStakingCostOfExitPoint,
  LiquidStakingYieldPoint,
} from './getLiquidStakingCharts'

/** Yields and the network line are measured over this many days. */
export const YIELD_WINDOW_DAYS = 30
/**
 * The exit the cost is measured for. A protocol's instant exit counts only
 * when it can pay this out, and the market quotes sell 100 tokens.
 */
export const REFERENCE_EXIT_ETH = 100
/** Requests still queued are estimated at the finalization pace of this many days. */
const PACE_WINDOW_DAYS = 7

export interface LiquidStakingChartToken {
  id: string
  type: ProjectLiquidStakingContracts['type']
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
  /** Hourly, oldest first, from YIELD_WINDOW_DAYS before the first day to now. */
  snapshots: LiquidStakingSnapshotRecord[]
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
): LiquidStakingCostOfExitPoint[] {
  const byProject = new Map(
    inputs.projects.map((project) => [
      project.id,
      new ExitCostSeries(
        project,
        inputs.snapshots.filter((s) => s.projectId === project.id),
      ),
    ]),
  )

  return inputs.days.map((day) => {
    const costs = inputs.projects.map(
      (p) => [p.id, byProject.get(p.id)?.costOfExitAt(day) ?? null] as const,
    )
    return {
      timestamp: day,
      projects: Object.fromEntries(
        costs.map(([id, cost]) => [id, cost?.days ?? null]),
      ),
      estimated: costs.filter(([, cost]) => cost?.estimated).map(([id]) => id),
    }
  })
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

interface ExitCost {
  days: number
  /** It counts requests still queued, at an estimated wait. */
  estimated: boolean
}

class ExitCostSeries {
  private readonly rates: ExchangeRates
  /** Day start → that day's hourly snapshots. */
  private readonly hoursByDay: Map<number, LiquidStakingSnapshotRecord[]>
  /** Request day → the request-weighted wait of its requests. */
  private readonly queueWaits: Map<number, ExitCost>

  constructor(
    private readonly project: LiquidStakingChartToken,
    snapshots: LiquidStakingSnapshotRecord[],
  ) {
    this.rates = new ExchangeRates(snapshots)
    this.hoursByDay = new Map()
    for (const snapshot of snapshots) {
      const day = UnixTime.toStartOf(snapshot.timestamp, 'day')
      const hours = this.hoursByDay.get(day) ?? []
      hours.push(snapshot)
      this.hoursByDay.set(day, hours)
    }
    const lockTimes = new Map(snapshots.map((s) => [s.timestamp, s.lockTime]))
    this.queueWaits = averageWaitByDay(
      getQueueWaits(snapshots),
      // An unwrapped wBETH request also waits out its lock.
      (timestamp) => lockTimes.get(timestamp) ?? 0,
    )
  }

  /** Days of yield an exit costs, by the cheapest route. */
  costOfExitAt(day: number): ExitCost | null {
    const annualYield = this.rates.yieldAt(day)
    const routes = [
      this.queueAt(day),
      this.instantAt(day, annualYield),
      this.marketAt(day, annualYield),
    ].filter((route): route is ExitCost => route !== null)
    return routes.reduce<ExitCost | null>(
      (best, route) => (best === null || route.days < best.days ? route : best),
      null,
    )
  }

  /** A queued exit earns nothing while it waits, so it costs the wait. */
  private queueAt(day: number): ExitCost | null {
    const wait = this.queueWaits.get(day)
    if (wait || this.project.type !== 'wbeth') return wait ?? null
    // Without requests that day, an exit would still wait out the lock.
    const lockTime = this.hoursByDay.get(day)?.[0]?.lockTime
    return lockTime != null ? { days: lockTime / DAY, estimated: false } : null
  }

  /**
   * Burning rETH, or ether.fi's instant redemption, when it could pay out the
   * reference exit for most of the day. The fee costs the days of yield it
   * equals.
   */
  private instantAt(day: number, annualYield: number | null): ExitCost | null {
    const hours = this.hoursByDay.get(day) ?? []
    const open = hours.filter(
      (s) =>
        s.instantExitEth !== null &&
        toEth(s.instantExitEth) >= REFERENCE_EXIT_ETH,
    )
    if (open.length === 0 || open.length * 2 < hours.length) return null
    const feeBps = median(open.map((s) => s.instantExitFeeBps ?? 0)) ?? 0
    const days = toYieldDays(feeBps / 10_000, annualYield)
    return days === null ? null : { days, estimated: false }
  }

  /** Selling at a discount costs the days of yield the discount equals. */
  private marketAt(day: number, annualYield: number | null): ExitCost | null {
    const discounts = (this.hoursByDay.get(day) ?? []).flatMap((s) =>
      s.marketExitEth !== null && s.marketExitValueEth
        ? [1 - toEth(s.marketExitEth) / toEth(s.marketExitValueEth)]
        : [],
    )
    const discount = median(discounts)
    if (discount === undefined) return null
    // Selling at a premium exits for free.
    const days = toYieldDays(Math.max(0, discount), annualYield)
    return days === null ? null : { days, estimated: false }
  }
}

/** A cost as a share of the exit, in the days of yield it takes to earn. */
function toYieldDays(cost: number, annualYield: number | null): number | null {
  if (cost === 0) return 0
  if (annualYield === null || annualYield <= 0) return null
  return (cost * 365) / annualYield
}

interface QueueWait {
  /** The snapshot that first counted the requests. */
  timestamp: number
  requests: number
  hours: number
  estimated: boolean
}

/**
 * Split each hour's requests by when they finalized. Both counters only
 * grow, so one pass finds every completed portion's wait. Requests still
 * queued at the last snapshot get an estimated wait.
 */
export function getQueueWaits(
  snapshots: Pick<
    LiquidStakingSnapshotRecord,
    'timestamp' | 'lastRequestId' | 'lastFinalizedRequestId'
  >[],
): QueueWait[] {
  const waits: QueueWait[] = []
  const queued: { timestamp: number; from: number; to: number }[] = []
  let finalizedAt = 0
  for (let i = 1; i < snapshots.length; i++) {
    const previous = snapshots[i - 1]?.lastRequestId
    const current = snapshots[i]
    if (previous == null || current?.lastRequestId == null) continue
    finalizedAt = Math.max(finalizedAt, i)
    let requestId = previous
    while (requestId < current.lastRequestId) {
      const finalized = snapshots[finalizedAt]
      if (finalized === undefined) {
        // Not finalized by the last snapshot, and later hours queue behind.
        queued.push({
          timestamp: current.timestamp,
          from: requestId,
          to: current.lastRequestId,
        })
        break
      }
      const last = Math.min(
        finalized.lastFinalizedRequestId ?? -1,
        current.lastRequestId,
      )
      if (last > requestId) {
        waits.push({
          timestamp: current.timestamp,
          requests: last - requestId,
          hours: (finalized.timestamp - current.timestamp) / UnixTime.HOUR,
          estimated: false,
        })
        requestId = last
      }
      if (requestId < current.lastRequestId) finalizedAt++
    }
  }
  return [...waits, ...estimateQueuedWaits(snapshots, queued)]
}

/**
 * Requests still queued finalize in order at the pace of the last
 * PACE_WINDOW_DAYS. With no pace to go by, each has waited at least until
 * the last snapshot.
 */
function estimateQueuedWaits(
  snapshots: Pick<
    LiquidStakingSnapshotRecord,
    'timestamp' | 'lastFinalizedRequestId'
  >[],
  queued: { timestamp: number; from: number; to: number }[],
): QueueWait[] {
  const last = snapshots.at(-1)
  const lastFinalized = last?.lastFinalizedRequestId
  if (last === undefined || lastFinalized == null) return []
  const paceStart = snapshots.find(
    (s) => s.timestamp >= last.timestamp - PACE_WINDOW_DAYS * DAY,
  )
  const finalizedPerHour =
    paceStart?.lastFinalizedRequestId != null && paceStart !== last
      ? (lastFinalized - paceStart.lastFinalizedRequestId) /
        ((last.timestamp - paceStart.timestamp) / UnixTime.HOUR)
      : 0

  return queued.map(({ timestamp, from, to }) => {
    // The middle request of the portion stands for all of it.
    const ahead = Math.max(0, (from + to) / 2 - lastFinalized)
    const hoursLeft = finalizedPerHour > 0 ? ahead / finalizedPerHour : 0
    return {
      timestamp,
      requests: to - from,
      hours: (last.timestamp - timestamp) / UnixTime.HOUR + hoursLeft,
      estimated: true,
    }
  })
}

/**
 * The request-weighted wait of each day's requests, in days. Requests made in
 * the hour before a snapshot belong to that hour, so midnight closes a day.
 * `minimumWait` is the wait, in seconds, of every request at a snapshot.
 */
function averageWaitByDay(
  waits: QueueWait[],
  minimumWait: (timestamp: number) => number,
): Map<number, ExitCost> {
  const totals = new Map<
    number,
    { requests: number; hours: number; estimated: boolean }
  >()
  for (const wait of waits) {
    const day = UnixTime.toStartOf(UnixTime(wait.timestamp - 1), 'day')
    const total = totals.get(day) ?? {
      requests: 0,
      hours: 0,
      estimated: false,
    }
    const hours = Math.max(
      wait.hours,
      minimumWait(wait.timestamp) / UnixTime.HOUR,
    )
    total.requests += wait.requests
    total.hours += wait.requests * hours
    total.estimated ||= wait.estimated
    totals.set(day, total)
  }
  return new Map(
    [...totals].map(([day, t]) => [
      day,
      { days: t.hours / t.requests / 24, estimated: t.estimated },
    ]),
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
