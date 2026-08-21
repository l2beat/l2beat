import { UnixTime } from '@l2beat/shared-pure'
import {
  extractDiffBlockAddress,
  extractDiffBlockSpans,
  isHighSeverityDiffBody,
  isImplementationChangeDiffBody,
} from '~/utils/diffHistory/diffHistoryMarkdown'
import type { DiscoveryUpdate } from '../recent-changes/getDiscoveryUpdates'
import { OSSIFICATION_CURVE } from './ossificationCurve'
/** Critical changes within this window count as a single event, so the
 *  rate measures project decisions (one fork, one governance execution),
 *  not how many fields we annotated. */
export const EVENT_CLUSTER_WINDOW_SECONDS = 24 * 60 * 60
const RATE_WINDOW_SECONDS = 3 * 365 * 24 * 60 * 60
const MIN_RATE_WINDOW_SECONDS = 30 * 24 * 60 * 60
const SECONDS_PER_YEAR = 365 * 24 * 60 * 60

/** A contract in the ossification perimeter, extracted from discovered.json */
export interface OssificationContractInput {
  /** Chain-specific address (eth:0x...) */
  address: string
  name: string
  isVerified: boolean
  /** Deployment timestamp */
  sinceTimestamp?: number
  /** One timestamp per $pastUpgrades transaction, sorted ascending. The first
   *  one is normally the initial implementation setting. */
  upgradeTimestamps: number[]
  /** False when historical storage evidence proves that the implementation was
   *  already nonzero before the first recognized upgrade event. */
  firstUpgradeIsInitialization?: boolean
}

export interface OssificationContractBreakdown {
  name: string
  address: string
  isVerified: boolean
  /** Start of the battle-tested clock: last critical change, or deployment
   *  if the contract never changed. Null when neither is known. */
  clockStart: number | null
  ageSeconds: number | null
  codeChangeCount: number
  stateChangeCount: number
}

export type OssificationChangeType = 'code' | 'state'

export interface OssificationCriticalUpdate {
  id: string
  type: OssificationChangeType
}

/** Reviewed event that cannot be reconstructed reliably from the current
 * discovery metadata. Keep these exceptional and evidence-backed in the
 * project's ossification.json. */
export interface OssificationCriticalEvent {
  timestamp: number
  type: OssificationChangeType
  /** Auditable onchain or repository evidence. */
  source: string
  /** One-sentence security consequence. */
  reason: string
  /** Discovery update card receiving the same critical code/state tag. */
  updateId?: string
  /** Current or historical contract receiving the per-contract count. Omit
   * only for a security-mechanism change stored on an excluded actor shell. */
  contract?: string
  /** Events on removed contracts affect history, but never the current clock. */
  historical?: boolean
}

export interface OssificationFactor {
  /** 0-100: the share of recorded code-bug exploits (published, versioned
   *  incident dataset — see ossificationCurve.ts) whose exploited code was
   *  younger than this perimeter's age. 0 while any critical contract is
   *  unverified. */
  score: number
  /** score as a 0..1 fraction; 0 gates exposure when unverified */
  maturity: number
  /** The project clock starts at the most recent deployment or critical
   *  change anywhere in the critical perimeter. */
  projectClockStart: number | null
  projectAgeSeconds: number | null
  /** Timestamp of the last observed critical change, null if none ever */
  lastCriticalChange: number | null
  lastCriticalChangeAgeSeconds: number | null
  /** 24h-clustered critical change events per year, trailing window */
  criticalChangesPerYear: number
  clusteredEventCount: number
  windowSeconds: number
  contracts: OssificationContractBreakdown[]
  criticalUpdates: OssificationCriticalUpdate[]
}

/** A contract that once belonged to the critical perimeter but no longer does.
 * Contributes its change events to the rate and history—never to the current
 * project clock or unverified gate. */
export interface OssificationHistoricalContract {
  address: string
  name: string
  upgradeTimestamps: number[]
}

interface ContractRecord {
  entry: OssificationContractInput
  diffEvents: { timestamp: number; type: OssificationChangeType }[]
}

export function getOssificationFactor(
  entries: OssificationContractInput[],
  updates: DiscoveryUpdate[],
  now: number = UnixTime.now(),
  historical: OssificationHistoricalContract[] = [],
  criticalEvents: OssificationCriticalEvent[] = [],
): OssificationFactor | undefined {
  if (entries.length === 0) {
    return undefined
  }

  const records = new Map<string, ContractRecord>()
  const byAddress = new Map<string, ContractRecord>()
  const currentByAddress = new Map<string, ContractRecord>()
  const historicalByAddress = new Map<string, ContractRecord>()
  const index = (
    record: ContractRecord,
    target: Map<string, ContractRecord>,
    overwrite = true,
  ) => {
    const key = record.entry.address.toLowerCase()
    if (overwrite || !target.has(key)) target.set(key, record)
    // Entries before the chain-prefix migration reference bare addresses
    const bareAddress = key.split(':').at(-1)
    if (bareAddress && (overwrite || !target.has(bareAddress))) {
      target.set(bareAddress, record)
    }
  }
  for (const entry of entries) {
    const key = entry.address.toLowerCase()
    if (records.has(key)) continue
    const record: ContractRecord = { entry, diffEvents: [] }
    records.set(key, record)
    index(record, currentByAddress)
    index(record, byAddress)
  }

  const historicalRecords: ContractRecord[] = historical
    .filter((entry) => !records.has(entry.address.toLowerCase()))
    .map((entry) => ({
      entry: { ...entry, isVerified: true },
      diffEvents: [],
    }))
  for (const record of historicalRecords) {
    index(record, historicalByAddress)
    // A current entry wins if an old entry happens to share a bare address.
    index(record, byAddress, false)
  }

  const criticalUpdates = collectDiffEvents(updates, byAddress)
  const reviewedEvents = collectCriticalEvents(
    criticalEvents,
    currentByAddress,
    historicalByAddress,
  )
  mergeCriticalUpdates(criticalUpdates, reviewedEvents.counted)

  const breakdowns: OssificationContractBreakdown[] = []
  const changeEvents: number[] = [
    ...reviewedEvents.standaloneCurrent,
    ...reviewedEvents.standaloneHistorical,
  ]
  for (const record of records.values()) {
    const breakdown = getContractBreakdown(record, now)
    breakdowns.push(breakdown)
    changeEvents.push(
      ...getCodeChangeTimestamps(record.entry),
      ...record.diffEvents.map((event) => event.timestamp),
    )
  }
  for (const record of historicalRecords) {
    changeEvents.push(
      ...getCodeChangeTimestamps(record.entry),
      ...record.diffEvents.map((event) => event.timestamp),
    )
  }

  const contractClockStart = getProjectClockStart(breakdowns)
  if (contractClockStart === null) return undefined
  const projectClockStart = Math.max(
    contractClockStart,
    reviewedEvents.standaloneCurrent.at(-1) ?? Number.NEGATIVE_INFINITY,
  )

  const projectAgeSeconds = Math.max(0, now - projectClockStart)
  const hasUnverifiedContract = breakdowns.some(
    (breakdown) => !breakdown.isVerified,
  )
  const maturity = hasUnverifiedContract
    ? 0
    : exploitAgePercentile(projectAgeSeconds)

  // youngest clock first
  breakdowns.sort((a, b) => (b.clockStart ?? 0) - (a.clockStart ?? 0))

  changeEvents.sort((a, b) => a - b)
  const clusters = clusterEvents(changeEvents)

  const observationStart = getObservationStart(
    [...records.values(), ...historicalRecords],
    reviewedEvents.counted,
  )
  const windowFrom = Math.max(
    now - RATE_WINDOW_SECONDS,
    observationStart ?? now - RATE_WINDOW_SECONDS,
  )
  const windowSeconds = Math.max(now - windowFrom, MIN_RATE_WINDOW_SECONDS)
  const clusteredEventCount = clusters.filter(
    (cluster) => cluster >= windowFrom,
  ).length

  const lastCriticalChange = changeEvents.at(-1) ?? null
  return {
    score: Math.round(maturity * 100),
    maturity,
    projectClockStart,
    projectAgeSeconds,
    lastCriticalChange,
    lastCriticalChangeAgeSeconds:
      lastCriticalChange !== null
        ? Math.max(0, now - lastCriticalChange)
        : null,
    criticalChangesPerYear:
      clusteredEventCount / (windowSeconds / SECONDS_PER_YEAR),
    clusteredEventCount,
    windowSeconds,
    contracts: breakdowns,
    criticalUpdates,
  }
}

function mergeCriticalUpdates(
  updates: OssificationCriticalUpdate[],
  events: OssificationCriticalEvent[],
): void {
  const byId = new Map(updates.map((update) => [update.id, update]))
  for (const event of events) {
    if (!event.updateId) continue
    const existing = byId.get(event.updateId)
    if (existing) {
      // A mixed code-and-state update is classified as code.
      if (event.type === 'code') existing.type = 'code'
      continue
    }
    const update = { id: event.updateId, type: event.type }
    updates.push(update)
    byId.set(update.id, update)
  }
}

function collectCriticalEvents(
  events: OssificationCriticalEvent[],
  currentByAddress: Map<string, ContractRecord>,
  historicalByAddress: Map<string, ContractRecord>,
): {
  standaloneCurrent: number[]
  standaloneHistorical: number[]
  counted: OssificationCriticalEvent[]
} {
  const standalone = {
    standaloneCurrent: [] as number[],
    standaloneHistorical: [] as number[],
    counted: [] as OssificationCriticalEvent[],
  }

  for (const event of events) {
    const target = event.historical ? historicalByAddress : currentByAddress
    const record = event.contract
      ? target.get(event.contract.toLowerCase())
      : undefined

    if (event.contract && !record) {
      // Attributed events remain gated by current/historical perimeter
      // membership. A mechanism change stored on an excluded actor shell is
      // deliberately represented without a contract instead.
      continue
    }

    standalone.counted.push(event)
    if (record) {
      if (
        !record.diffEvents.some(
          (existing) =>
            existing.timestamp === event.timestamp &&
            existing.type === event.type,
        )
      ) {
        record.diffEvents.push({ timestamp: event.timestamp, type: event.type })
      }
    } else {
      standalone[
        event.historical ? 'standaloneHistorical' : 'standaloneCurrent'
      ].push(event.timestamp)
    }
  }

  for (const record of [
    ...new Set(currentByAddress.values()),
    ...new Set(historicalByAddress.values()),
  ]) {
    record.diffEvents.sort((a, b) => a.timestamp - b.timestamp)
  }
  standalone.standaloneCurrent.sort((a, b) => a - b)
  standalone.standaloneHistorical.sort((a, b) => a - b)
  return standalone
}

function collectDiffEvents(
  updates: DiscoveryUpdate[],
  byAddress: Map<string, ContractRecord>,
): OssificationCriticalUpdate[] {
  const criticalUpdates: OssificationCriticalUpdate[] = []

  for (const update of updates) {
    const evidenceByRecord = new Map<
      ContractRecord,
      { hasCodeChange: boolean; hasStateChange: boolean }
    >()

    for (const section of update.sections) {
      if (section.kind !== 'watched-changes') continue
      for (const { content } of extractDiffBlockSpans(section.body)) {
        const address = extractDiffBlockAddress(content)
        if (!address) continue
        const record = byAddress.get(address)
        if (!record) continue

        const evidence = evidenceByRecord.get(record) ?? {
          hasCodeChange: false,
          hasStateChange: false,
        }
        if (isImplementationChangeDiffBody(content)) {
          evidence.hasCodeChange = true
        } else if (isHighSeverityDiffBody(content)) {
          evidence.hasStateChange = true
        }
        evidenceByRecord.set(record, evidence)
      }
    }

    let updateType: OssificationChangeType | undefined
    for (const [record, evidence] of evidenceByRecord) {
      if (evidence.hasCodeChange) {
        // Implementation changes come from $pastUpgrades (onchain
        // timestamps, full history); only fall back to the diff entry
        // for proxies whose upgrades emit no recognized event. A mixed
        // code-and-state update is classified as one code change.
        updateType = 'code'
        if (
          record.entry.upgradeTimestamps.length === 0 &&
          update.timestamp !== null
        ) {
          record.diffEvents.push({ timestamp: update.timestamp, type: 'code' })
        }
      } else if (evidence.hasStateChange) {
        updateType ??= 'state'
        if (update.timestamp !== null) {
          record.diffEvents.push({ timestamp: update.timestamp, type: 'state' })
        }
      }
    }

    if (updateType !== undefined) {
      criticalUpdates.push({ id: update.id, type: updateType })
    }
  }

  for (const record of new Set(byAddress.values())) {
    record.diffEvents.sort((a, b) => a.timestamp - b.timestamp)
  }
  return criticalUpdates
}

function getContractBreakdown(
  record: ContractRecord,
  now: number,
): OssificationContractBreakdown {
  const { entry, diffEvents } = record
  const lastReset = Math.max(
    entry.sinceTimestamp ?? Number.NEGATIVE_INFINITY,
    entry.upgradeTimestamps.at(-1) ?? Number.NEGATIVE_INFINITY,
    diffEvents.at(-1)?.timestamp ?? Number.NEGATIVE_INFINITY,
  )
  const clockStart = Number.isFinite(lastReset) ? lastReset : null

  return {
    name: entry.name,
    address: entry.address,
    isVerified: entry.isVerified,
    clockStart,
    ageSeconds: clockStart !== null ? Math.max(0, now - clockStart) : null,
    codeChangeCount:
      getCodeChangeTimestamps(entry).length +
      diffEvents.filter((event) => event.type === 'code').length,
    stateChangeCount: diffEvents.filter((event) => event.type === 'state')
      .length,
  }
}

function getCodeChangeTimestamps(entry: OssificationContractInput): number[] {
  return entry.upgradeTimestamps.slice(
    entry.firstUpgradeIsInitialization === false ? 0 : 1,
  )
}

function clusterEvents(sortedEvents: number[]): number[] {
  const clusterStarts: number[] = []
  for (const event of sortedEvents) {
    const currentStart = clusterStarts.at(-1)
    if (
      currentStart === undefined ||
      event - currentStart > EVENT_CLUSTER_WINDOW_SECONDS
    ) {
      clusterStarts.push(event)
    }
  }
  return clusterStarts
}

function getObservationStart(
  records: ContractRecord[],
  criticalEvents: OssificationCriticalEvent[],
): number | null {
  let start: number | null = null
  for (const record of records) {
    const candidates = [
      record.entry.sinceTimestamp,
      record.entry.upgradeTimestamps[0],
      record.diffEvents[0]?.timestamp,
    ].filter((timestamp) => timestamp !== undefined)
    for (const candidate of candidates) {
      if (start === null || candidate < start) {
        start = candidate
      }
    }
  }
  for (const event of criticalEvents) {
    if (start === null || event.timestamp < start) {
      start = event.timestamp
    }
  }
  return start
}

/** Interpolated percentile of `ageSeconds` within the published exploit-age
 *  curve: the share of recorded code-bug exploits whose exploited code was
 *  younger. Uses Weibull plotting positions p_i = (i+1)/(n+1), linear between
 *  knots, so the score approaches (not fakes) 0 and 100 at the extremes. */
export function exploitAgePercentile(ageSeconds: number): number {
  const knots: readonly number[] = OSSIFICATION_CURVE.ageKnots
  const n = knots.length
  if (n === 0) return 0
  const p = (index: number) => (index + 1) / (n + 1)
  const first = knots[0] ?? 0
  if (ageSeconds <= first) {
    return first <= 0 ? p(0) : (ageSeconds / first) * p(0)
  }
  const last = knots[n - 1] ?? 0
  if (ageSeconds >= last) return p(n - 1)
  // binary search: last knot <= ageSeconds
  let lo = 0
  let hi = n - 1
  while (lo + 1 < hi) {
    const mid = (lo + hi) >> 1
    if ((knots[mid] ?? 0) <= ageSeconds) lo = mid
    else hi = mid
  }
  const a = knots[lo] ?? 0
  const b = knots[hi] ?? a
  const frac = b > a ? (ageSeconds - a) / (b - a) : 0
  return p(lo) + frac * (p(hi) - p(lo))
}

function getProjectClockStart(
  breakdowns: OssificationContractBreakdown[],
): number | null {
  let projectClockStart: number | null = null
  for (const breakdown of breakdowns) {
    // Every critical contract is part of the project-wide perimeter. If any
    // individual clock is unknown, the age of the complete perimeter is too.
    if (breakdown.clockStart === null) return null
    projectClockStart = Math.max(
      projectClockStart ?? Number.NEGATIVE_INFINITY,
      breakdown.clockStart,
    )
  }
  return projectClockStart
}
