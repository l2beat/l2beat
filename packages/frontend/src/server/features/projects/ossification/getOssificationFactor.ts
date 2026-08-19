import { UnixTime } from '@l2beat/shared-pure'
import mean from 'lodash/mean'
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
  /** 0-100, mean maturity over the contract perimeter */
  score: number
  /** Timestamp of the last observed critical change, null if none ever */
  lastCriticalChange: number | null
  lastCriticalChangeAgeSeconds: number | null
  /** The contract whose clock started most recently */
  weakestLink: { name: string; address: string; ageSeconds: number } | null
  /** 24h-clustered critical change events per year, trailing window */
  criticalChangesPerYear: number
  clusteredEventCount: number
  windowSeconds: number
  contracts: OssificationContractBreakdown[]
  unknownAgeCount: number
}

interface ContractRecord {
  entry: OssificationEntry
  diffEventTimestamps: number[]
}

export function getOssificationFactor(
  entries: OssificationEntry[],
  updates: DiscoveryUpdate[],
  now: number = UnixTime.now(),
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
  let unknownAgeCount = 0
  for (const record of records.values()) {
    const breakdown = getContractBreakdown(record, now)
    breakdowns.push(breakdown)
    if (breakdown.clockStart === null) {
      unknownAgeCount++
    }
    changeEvents.push(
      ...record.entry.upgradeTimestamps.slice(1),
      ...record.diffEventTimestamps,
    )
  }

  const maturities = breakdowns
    .map((breakdown) => breakdown.maturity)
    .filter((maturity) => maturity !== null)
  if (maturities.length === 0) {
    return undefined
  }

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
    score: Math.round(mean(maturities) * 100),
    lastCriticalChange,
    lastCriticalChangeAgeSeconds:
      lastCriticalChange !== null
        ? Math.max(0, now - lastCriticalChange)
        : null,
    weakestLink: getWeakestLink(breakdowns, now),
    criticalChangesPerYear:
      clusteredEventCount / (windowSeconds / SECONDS_PER_YEAR),
    clusteredEventCount,
    windowSeconds,
    contracts: breakdowns,
    unknownAgeCount,
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

function getWeakestLink(
  breakdowns: OssificationContractBreakdown[],
  now: number,
): OssificationFactor['weakestLink'] {
  let weakest: OssificationContractBreakdown | undefined
  for (const breakdown of breakdowns) {
    if (breakdown.clockStart === null) continue
    if (!weakest || breakdown.clockStart > (weakest.clockStart ?? 0)) {
      weakest = breakdown
    }
  }
  if (!weakest || weakest.clockStart === null) {
    return null
  }
  return {
    name: weakest.name,
    address: weakest.address,
    ageSeconds: Math.max(0, now - weakest.clockStart),
  }
}
