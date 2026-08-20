import { UnixTime } from '@l2beat/shared-pure'
import {
  extractDiffBlockAddress,
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
  codeChangeCount: number
  stateChangeCount: number
}

export type OssificationChangeType = 'code' | 'state'

export interface OssificationCriticalUpdate {
  id: string
  type: OssificationChangeType
}

export interface OssificationFactor {
  /** 0-100 maturity of the project-wide critical perimeter */
  score: number
  /** 0..1 maturity of the project-wide critical perimeter */
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

/** A contract that once was in the critical perimeter but has since been
 *  removed from discovery (classified in ossification.json). Contributes
 *  its change events to the rate and history — never to the project clock
 *  or the unverified gate, since it no longer secures funds. */
export interface OssificationHistoricalEntry {
  address: string
  name: string
  upgradeTimestamps: number[]
}

interface ContractRecord {
  entry: OssificationEntry
  diffEvents: { timestamp: number; type: OssificationChangeType }[]
}

export function getOssificationFactor(
  entries: OssificationEntry[],
  updates: DiscoveryUpdate[],
  now: number = UnixTime.now(),
  historical: OssificationHistoricalEntry[] = [],
): OssificationFactor | undefined {
  if (entries.length === 0) {
    return undefined
  }

  const records = new Map<string, ContractRecord>()
  const byAddress = new Map<string, ContractRecord>()
  const index = (record: ContractRecord) => {
    const key = record.entry.address.toLowerCase()
    byAddress.set(key, record)
    // Entries before the chain-prefix migration reference bare addresses
    const bareAddress = key.split(':').at(-1)
    if (bareAddress) {
      byAddress.set(bareAddress, record)
    }
  }
  for (const entry of entries) {
    const key = entry.address.toLowerCase()
    if (records.has(key)) continue
    const record: ContractRecord = { entry, diffEvents: [] }
    records.set(key, record)
    index(record)
  }

  const historicalRecords: ContractRecord[] = historical
    .filter((entry) => !records.has(entry.address.toLowerCase()))
    .map((entry) => ({
      entry: { ...entry, isVerified: true },
      diffEvents: [],
    }))
  for (const record of historicalRecords) {
    index(record)
  }

  const criticalUpdates = collectDiffEvents(updates, byAddress)

  const breakdowns: OssificationContractBreakdown[] = []
  const changeEvents: number[] = []
  for (const record of records.values()) {
    const breakdown = getContractBreakdown(record, now)
    breakdowns.push(breakdown)
    changeEvents.push(
      ...record.entry.upgradeTimestamps.slice(1),
      ...record.diffEvents.map((event) => event.timestamp),
    )
  }
  for (const record of historicalRecords) {
    changeEvents.push(
      ...record.entry.upgradeTimestamps.slice(1),
      ...record.diffEvents.map((event) => event.timestamp),
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

  // youngest clock first
  breakdowns.sort((a, b) => (b.clockStart ?? 0) - (a.clockStart ?? 0))

  changeEvents.sort((a, b) => a - b)
  const clusters = clusterEvents(changeEvents)

  const observationStart = getObservationStart([
    ...records.values(),
    ...historicalRecords,
  ])
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
      Math.max(0, entry.upgradeTimestamps.length - 1) +
      diffEvents.filter((event) => event.type === 'code').length,
    stateChangeCount: diffEvents.filter((event) => event.type === 'state')
      .length,
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

function getObservationStart(records: ContractRecord[]): number | null {
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
