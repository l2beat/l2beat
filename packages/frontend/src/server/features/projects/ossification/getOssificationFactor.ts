import { UnixTime } from '@l2beat/shared-pure'
import {
  extractDiffBlockSpans,
  isHighSeverityDiffBody,
  isImplementationChangeDiffBody,
} from '~/utils/diffHistory/diffHistoryMarkdown'
import type { DiscoveryUpdate } from '../recent-changes/getDiscoveryUpdates'

/** Maturity time constant: m(age) = 1 - exp(-age / lambda).
 *  Two years, per the slow decay of residual vulnerability rates in
 *  unchanged code (Ozment & Schechter 2006). */
export const OSSIFICATION_LAMBDA_SECONDS = 2 * 365 * 24 * 60 * 60
/** Critical changes within this window count as a single event, so the
 *  rate measures project decisions (one fork, one governance execution),
 *  not how many fields we annotated. */
export const EVENT_CLUSTER_WINDOW_SECONDS = 24 * 60 * 60
const RATE_WINDOW_SECONDS = 3 * 365 * 24 * 60 * 60
const MIN_RATE_WINDOW_SECONDS = 30 * 24 * 60 * 60
const SECONDS_PER_YEAR = 365 * 24 * 60 * 60

const DIFF_BLOCK_ADDRESS_RE =
  /^\s*(?:contract\s+.*?|EOA\s*)\(((?:\w+:)?0x[0-9a-fA-F]{40})\)/m

/** A contract in the ossification perimeter, extracted from discovered.json */
export interface OssificationEntry {
  /** Chain-specific address (eth:0x...) */
  address: string
  name: string
  isVerified: boolean
  /** Deployment timestamp */
  sinceTimestamp?: number
  /** Timestamps from $pastUpgrades, sorted ascending. The first one is the
   *  initial implementation setting, not a change. */
  upgradeTimestamps: number[]
}

export interface OssificationContractBreakdown {
  name: string
  address: string
  isVerified: boolean
  /** Start of the battle-tested clock: last critical change, or deployment
   *  if the contract never changed. Null when neither is known. */
  clockStart: number | null
  ageSeconds: number | null
  hasChanged: boolean
  criticalChangeCount: number
  /** 0..1, null when clockStart is unknown */
  maturity: number | null
}

export interface OssificationFactor {
  /** 0-100 maturity of the project-wide critical perimeter */
  score: number
  /** 0..1 maturity of the project-wide critical perimeter */
  maturity: number
  /** Current project TVS in USD. Null when TVS data is unavailable. */
  currentTvs: number | null
  /** Current TVS multiplied by project maturity. This expresses the
   *  accumulated adversarial exposure in present-day USD terms. */
  implicitBugBounty: number | null
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
}

interface ContractRecord {
  entry: OssificationEntry
  diffEventTimestamps: number[]
}

export function getOssificationFactor(
  entries: OssificationEntry[],
  updates: DiscoveryUpdate[],
  now: number = UnixTime.now(),
  currentTvs?: number,
): OssificationFactor | undefined {
  if (entries.length === 0) {
    return undefined
  }

  const records = new Map<string, ContractRecord>()
  const byAddress = new Map<string, ContractRecord>()
  for (const entry of entries) {
    const key = entry.address.toLowerCase()
    if (records.has(key)) continue
    const record: ContractRecord = { entry, diffEventTimestamps: [] }
    records.set(key, record)
    byAddress.set(key, record)
    // Entries before the chain-prefix migration reference bare addresses
    const bareAddress = key.split(':').at(-1)
    if (bareAddress) {
      byAddress.set(bareAddress, record)
    }
  }

  collectDiffEvents(updates, byAddress)

  const breakdowns: OssificationContractBreakdown[] = []
  const changeEvents: number[] = []
  for (const record of records.values()) {
    const breakdown = getContractBreakdown(record, now)
    breakdowns.push(breakdown)
    changeEvents.push(
      ...record.entry.upgradeTimestamps.slice(1),
      ...record.diffEventTimestamps,
    )
  }

  const projectClockStart = getProjectClockStart(breakdowns)
  if (projectClockStart === null) return undefined

  const projectAgeSeconds = Math.max(0, now - projectClockStart)
  const hasUnverifiedContract = breakdowns.some(
    (breakdown) => !breakdown.isVerified,
  )
  const maturity = hasUnverifiedContract
    ? 0
    : 1 - Math.exp(-projectAgeSeconds / OSSIFICATION_LAMBDA_SECONDS)
  const validCurrentTvs =
    currentTvs !== undefined && Number.isFinite(currentTvs) && currentTvs >= 0
      ? currentTvs
      : null

  breakdowns.sort((a, b) => {
    if (a.maturity === null) return 1
    if (b.maturity === null) return -1
    return a.maturity - b.maturity
  })

  changeEvents.sort((a, b) => a - b)
  const clusters = clusterEvents(changeEvents)

  const observationStart = getObservationStart(records)
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
    currentTvs: validCurrentTvs,
    implicitBugBounty:
      validCurrentTvs !== null ? validCurrentTvs * maturity : null,
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
  }
}

function collectDiffEvents(
  updates: DiscoveryUpdate[],
  byAddress: Map<string, ContractRecord>,
) {
  for (const update of updates) {
    if (update.timestamp === null) continue
    for (const section of update.sections) {
      if (section.kind !== 'watched-changes') continue
      for (const { content } of extractDiffBlockSpans(section.body)) {
        const address = DIFF_BLOCK_ADDRESS_RE.exec(content)?.[1]?.toLowerCase()
        if (!address) continue
        const record = byAddress.get(address)
        if (!record) continue
        if (isImplementationChangeDiffBody(content)) {
          // Implementation changes come from $pastUpgrades (onchain
          // timestamps, full history); only fall back to the diff entry
          // for proxies whose upgrades emit no recognized event
          if (record.entry.upgradeTimestamps.length > 0) continue
          record.diffEventTimestamps.push(update.timestamp)
        } else if (isHighSeverityDiffBody(content)) {
          record.diffEventTimestamps.push(update.timestamp)
        }
      }
    }
  }
  for (const record of byAddress.values()) {
    record.diffEventTimestamps.sort((a, b) => a - b)
  }
}

function getContractBreakdown(
  record: ContractRecord,
  now: number,
): OssificationContractBreakdown {
  const { entry, diffEventTimestamps } = record
  const lastReset = Math.max(
    entry.upgradeTimestamps.at(-1) ?? Number.NEGATIVE_INFINITY,
    diffEventTimestamps.at(-1) ?? Number.NEGATIVE_INFINITY,
  )
  const hasChanged =
    entry.upgradeTimestamps.length > 1 || diffEventTimestamps.length > 0
  const clockStart = Number.isFinite(lastReset)
    ? lastReset
    : (entry.sinceTimestamp ?? null)

  const maturity = !entry.isVerified
    ? 0
    : clockStart !== null
      ? 1 -
        Math.exp(-Math.max(0, now - clockStart) / OSSIFICATION_LAMBDA_SECONDS)
      : null

  return {
    name: entry.name,
    address: entry.address,
    isVerified: entry.isVerified,
    clockStart,
    ageSeconds: clockStart !== null ? Math.max(0, now - clockStart) : null,
    hasChanged,
    criticalChangeCount:
      Math.max(0, entry.upgradeTimestamps.length - 1) +
      diffEventTimestamps.length,
    maturity,
  }
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
  records: Map<string, ContractRecord>,
): number | null {
  let start: number | null = null
  for (const record of records.values()) {
    const candidates = [
      record.entry.sinceTimestamp,
      record.entry.upgradeTimestamps[0],
      record.diffEventTimestamps[0],
    ].filter((timestamp) => timestamp !== undefined)
    for (const candidate of candidates) {
      if (start === null || candidate < start) {
        start = candidate
      }
    }
  }
  return start
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
