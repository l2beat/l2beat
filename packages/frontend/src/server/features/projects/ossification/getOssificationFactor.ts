import {
  type DiscoveryChangelogEntry,
  type DiscoveryChangelogField,
  normalizeDiffValueLines,
} from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { OSSIFICATION_CURVE_AGE_KNOTS } from './ossificationCurve'
/** Critical changes within this window count as a single event, so the
 *  rate measures project decisions (one fork, one governance execution),
 *  not how many fields we annotated. */
export const EVENT_CLUSTER_WINDOW_SECONDS = 24 * 60 * 60
const RATE_WINDOW_SECONDS = 3 * 365 * 24 * 60 * 60
const MIN_RATE_WINDOW_SECONDS = 30 * 24 * 60 * 60
const SECONDS_PER_YEAR = 365 * 24 * 60 * 60
/** A diff update carrying an appended $pastUpgrades entry is dated at that
 *  onchain transaction instead of the discovery-run timestamp, as long as the
 *  transaction falls inside this window before the run. Governance actions
 *  routinely bundle an upgrade with state changes on sibling contracts; the
 *  review can lag the transaction by more than the cluster window, which
 *  would otherwise split one decision into two events. Older appends are
 *  handler backfills, not fresh observations, and keep the run timestamp. */
const UPGRADE_SNAP_WINDOW_SECONDS = 14 * 24 * 60 * 60
/** Fields carrying the code channel: their diffs are covered by
 *  $pastUpgrades / implementation detection and never count as state. */
const CODE_CHANNEL_FIELDS = new Set([
  '$implementation',
  '$pastUpgrades',
  '$upgradeCount',
])

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
  /** Field names whose current curated severity is HIGH (discovered.json
   *  fieldMeta). State diffs count against this set for the contract's whole
   *  history: severity judgments apply retroactively in both directions, so a
   *  re-classification today reclassifies past changes too. */
  highSeverityFields?: string[]
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
  /** 24h-clustered timestamps of every perimeter reset, ascending: critical
   *  changes plus deployments of critical contracts. Deployments never count
   *  toward the change rate, but they do move the clock, so a timeline that
   *  omitted them would contradict `projectClockStart`. */
  perimeterResets: number[]
  contracts: OssificationContractBreakdown[]
  criticalUpdates: OssificationCriticalUpdate[]
}

/** A contract that once belonged to the critical perimeter but no longer does.
 * A closed, reviewed ledger: onchain upgrade timestamps here plus reviewed
 * `criticalEvents` (historical: true) are its complete change history — diff
 * history is never consulted for it. Contributes only to the rate and
 * history, never to the current project clock or unverified gate. */
export interface OssificationHistoricalContract {
  address: string
  name: string
  upgradeTimestamps: number[]
}

interface ContractRecord {
  entry: OssificationContractInput
  diffEvents: { timestamp: number; type: OssificationChangeType }[]
  highFields: Set<string>
}

export function getOssificationFactor(
  entries: OssificationContractInput[],
  changelog: DiscoveryChangelogEntry[],
  now: number = UnixTime.now(),
  historical: OssificationHistoricalContract[] = [],
  criticalEvents: OssificationCriticalEvent[] = [],
): OssificationFactor | undefined {
  if (entries.length === 0) {
    return undefined
  }

  const records = new Map<string, ContractRecord>()
  const currentByAddress = new Map<string, ContractRecord>()
  const historicalByAddress = new Map<string, ContractRecord>()
  const index = (
    record: ContractRecord,
    target: Map<string, ContractRecord>,
  ) => {
    const key = record.entry.address.toLowerCase()
    target.set(key, record)
    // Entries before the chain-prefix migration reference bare addresses
    const bareAddress = key.split(':').at(-1)
    if (bareAddress) target.set(bareAddress, record)
  }
  for (const entry of entries) {
    const key = entry.address.toLowerCase()
    if (records.has(key)) continue
    const record: ContractRecord = {
      entry,
      diffEvents: [],
      highFields: new Set(entry.highSeverityFields ?? []),
    }
    records.set(key, record)
    index(record, currentByAddress)
  }

  // Historical contracts are a closed reviewed ledger (upgrade timestamps +
  // reviewed events); diff history never attaches to them.
  const historicalRecords: ContractRecord[] = historical
    .filter((entry) => !records.has(entry.address.toLowerCase()))
    .map((entry) => ({
      entry: { ...entry, isVerified: true },
      diffEvents: [],
      highFields: new Set<string>(),
    }))
  for (const record of historicalRecords) {
    index(record, historicalByAddress)
  }

  const criticalUpdates = collectDiffEvents(
    changelog,
    currentByAddress,
    getSupersededUpdates(criticalEvents),
  )
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
  const deployments = [...records.values(), ...historicalRecords].flatMap(
    (record) => record.entry.sinceTimestamp ?? [],
  )
  const perimeterResets = clusterEvents(
    [...changeEvents, ...deployments].sort((a, b) => a - b),
  )

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
    score: toDisplayScore(maturity),
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
    perimeterResets,
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

/** Update ids whose mechanical diff events are replaced by a reviewed
 *  criticalEvents entry, per attributed contract (both address forms). The
 *  reviewed event carries the precise onchain timestamp, so counting the
 *  review-time diff as well would double the same decision. */
function getSupersededUpdates(
  events: OssificationCriticalEvent[],
): Map<string, Set<string>> {
  const superseded = new Map<string, Set<string>>()
  for (const event of events) {
    if (!event.updateId || !event.contract) continue
    const contracts = superseded.get(event.updateId) ?? new Set<string>()
    const key = event.contract.toLowerCase()
    contracts.add(key)
    const bareAddress = key.split(':').at(-1)
    if (bareAddress) contracts.add(bareAddress)
    superseded.set(event.updateId, contracts)
  }
  return superseded
}

function collectDiffEvents(
  changelog: DiscoveryChangelogEntry[],
  byAddress: Map<string, ContractRecord>,
  supersededUpdates: Map<string, Set<string>>,
): OssificationCriticalUpdate[] {
  const criticalUpdates: OssificationCriticalUpdate[] = []

  for (const update of changelog) {
    const evidenceByRecord = new Map<
      ContractRecord,
      { hasCodeChange: boolean; hasStateChange: boolean }
    >()
    const appendedUpgradeTimestamps: number[] = []
    const superseded = supersededUpdates.get(update.id)

    for (const change of update.changes) {
      for (const field of change.fields ?? []) {
        const appended = appendedUpgradeTimestamp(field)
        if (appended !== undefined) {
          appendedUpgradeTimestamps.push(appended)
        }
      }
      const address = change.address.toLowerCase()
      const record = byAddress.get(address)
      if (!record) continue
      if (
        superseded?.has(record.entry.address.toLowerCase()) ||
        superseded?.has(address)
      ) {
        continue
      }

      const evidence = evidenceByRecord.get(record) ?? {
        hasCodeChange: false,
        hasStateChange: false,
      }
      if ((change.fields ?? []).some(isImplementationChangeField)) {
        evidence.hasCodeChange = true
      } else if (
        (change.fields ?? []).some((field) =>
          isCriticalStateField(record, field),
        )
      ) {
        evidence.hasStateChange = true
      }
      evidenceByRecord.set(record, evidence)
    }

    const timestamp = getUpdateEventTimestamp(
      update.timestamp,
      appendedUpgradeTimestamps,
    )

    let updateType: OssificationChangeType | undefined
    for (const [record, evidence] of evidenceByRecord) {
      if (evidence.hasCodeChange) {
        // Implementation changes come from $pastUpgrades (onchain
        // timestamps, full history); only fall back to the diff entry
        // for proxies whose upgrades emit no recognized event. A mixed
        // code-and-state update is classified as one code change.
        updateType = 'code'
        if (record.entry.upgradeTimestamps.length === 0 && timestamp !== null) {
          record.diffEvents.push({ timestamp, type: 'code' })
        }
      } else if (evidence.hasStateChange) {
        updateType ??= 'state'
        if (timestamp !== null) {
          record.diffEvents.push({ timestamp, type: 'state' })
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

/** The severity-carrying unit of a changelog field path: the first segment,
 *  matching the key used in discovered.json `fieldMeta`. Legacy
 *  `upgradeability.X` paths map to their modern `$X` field names. */
function canonicalDiffField(key: string): string | undefined {
  const dot = key.indexOf('.')
  if (dot === -1) return undefined
  const prefix = key.slice(0, dot)
  const first = key.slice(dot + 1).split('.')[0] ?? ''
  if (prefix === 'values') return first
  if (prefix === 'upgradeability') return `$${first}`
  return undefined
}

/** Representation-only rewrites (chain-prefix migrations, reorderings) are
 *  not changes: both sides agree after normalization. */
function isRepresentationOnly(field: DiscoveryChangelogField): boolean {
  return (
    (field.removed?.length ?? 0) > 0 &&
    normalizeDiffValueLines(field.removed ?? []) ===
      normalizeDiffValueLines(field.added ?? [])
  )
}

/** An executable-code change: an actual `$implementation` change, or a
 *  freshly appended `$pastUpgrades` entry (a new onchain upgrade observed by
 *  discovery). Anchored to parsed field paths, so `"implementation":` inside
 *  another field's value (e.g. a decoded timelock queue) never matches. */
function isImplementationChangeField(field: DiscoveryChangelogField): boolean {
  if (canonicalDiffField(field.key) === '$implementation') {
    return (
      ((field.removed?.length ?? 0) > 0 || (field.added?.length ?? 0) > 0) &&
      !isRepresentationOnly(field)
    )
  }
  return appendedUpgradeTimestamp(field) !== undefined
}

/** A state diff counts iff it touches a field whose CURRENT curated severity
 *  is HIGH — the committed annotation is only a snapshot of the judgment in
 *  force at review time, and judgments are reviewable. */
function isCriticalStateField(
  record: ContractRecord,
  field: DiscoveryChangelogField,
): boolean {
  const name = canonicalDiffField(field.key)
  return (
    name !== undefined &&
    record.highFields.has(name) &&
    !CODE_CHANNEL_FIELDS.has(name) &&
    !isRepresentationOnly(field)
  )
}

const APPENDED_UPGRADE_VALUE_RE = /^\["(\d{4}-\d{2}-\d{2}T[0-9:.]+Z)"/

/** The onchain timestamp of a freshly appended `$pastUpgrades` entry: a new
 *  single-index element (added, nothing removed) whose value embeds the
 *  transaction time. Whole-array additions and sub-index format migrations
 *  are handler backfills, not fresh observations. */
function appendedUpgradeTimestamp(
  field: DiscoveryChangelogField,
): number | undefined {
  if (!/^values\.\$pastUpgrades\.\d+$/.test(field.key)) return undefined
  if ((field.removed?.length ?? 0) > 0) return undefined
  const match = APPENDED_UPGRADE_VALUE_RE.exec(field.added?.[0] ?? '')
  if (match?.[1] === undefined) return undefined
  const parsed = Date.parse(match[1])
  return Number.isFinite(parsed) ? Math.floor(parsed / 1000) : undefined
}

/** Events in an update carrying a fresh onchain $pastUpgrades append are
 *  dated at that transaction (the newest one, staying conservative) instead
 *  of the later discovery-run timestamp. */
function getUpdateEventTimestamp(
  updateTimestamp: number | null,
  appendedUpgradeTimestamps: number[],
): number | null {
  if (updateTimestamp === null) return null
  const onchain = appendedUpgradeTimestamps
    .filter(
      (timestamp) =>
        timestamp <= updateTimestamp &&
        updateTimestamp - timestamp <= UPGRADE_SNAP_WINDOW_SECONDS,
    )
    .sort((a, b) => a - b)
    .at(-1)
  return onchain ?? updateTimestamp
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
  const knots: readonly number[] = OSSIFICATION_CURVE_AGE_KNOTS
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

/** Rounded display score, clamped to 1..99 for verified perimeters: the
 *  percentile never truly reaches the extremes, and 0 must stay reserved for
 *  the unverified gate so a gated project is distinguishable from a merely
 *  young one. */
export function toDisplayScore(maturity: number): number {
  if (maturity === 0) return 0
  return Math.min(99, Math.max(1, Math.round(maturity * 100)))
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
