import { UnixTime } from '@l2beat/shared-pure'
import { existsSync, readFileSync, statSync } from 'fs'
import path from 'path'
import { env } from '~/env'
import { getDb } from '~/server/database'
import {
  type DiscoveryUpdate,
  getDiscoveryUpdates,
} from '../recent-changes/getDiscoveryUpdates'
import {
  type BattleTestedExposurePoint,
  calculateBattleTestedExposure,
} from './calculateBattleTestedExposure'
import {
  getOssificationFactor,
  type OssificationContractInput,
  type OssificationCriticalEvent,
  type OssificationFactor,
} from './getOssificationFactor'
import type { DiscoveredEntryLite } from './getOssificationPerimeter'
import {
  deduplicateUpgradeTimestamps,
  parseUpgradeTimestamps,
} from './parseUpgradeTimestamps'

const PROJECT_ID_RE = /^[a-z0-9-]+$/i

/** The mini timeline covers a trailing year. Long enough to hold a full
 *  governance cycle, short enough that a single event stays distinguishable at
 *  table-cell width. */
const TIMELINE_WINDOW_SECONDS = 365 * 24 * 60 * 60
/** Weekly resolution — roughly one sample per 2.5 pixels of the rendered cell. */
const TIMELINE_SAMPLES = 52

const fileCache = new Map<string, { mtimeMs: number; parsed: unknown }>()

export interface ProjectOssification extends OssificationFactor {
  /** Project TVS integrated over the current unchanged period, in USD·years. */
  exposure: number | null
  timeline: OssificationTimeline
}

/** Input for the summary table's mini timeline. The window is identical for
 *  every project so the cells can be read against each other; only the TVS
 *  height is normalized per project. */
export interface OssificationTimeline {
  from: number
  to: number
  /** Start of the unchanged period. May predate `from`. */
  clockStart: number | null
  /** Clustered perimeter resets inside the window, ascending. */
  resets: number[]
  /** TVS sampled at `TIMELINE_SAMPLES` points spaced evenly from `from` to
   *  `to` inclusive, so an index maps straight onto the x axis. Null entries
   *  precede the start of the series; null altogether when the project has no
   *  TVS data (or in mock mode). */
  tvs: (number | null)[] | null
}

/** Committed judgment file — the opt-in marker for the ossification factor.
 *  `includeProjects`: discovery projects whose critical contracts and change
 *  history count as part of this project's perimeter (tightly integrated
 *  shared modules, e.g. zksync2 <- shared-zk-stack). Their events are
 *  clustered together with the project's own.
 *  `historicalContracts`: contracts that once were critical but have left the
 *  current perimeter, classified by the research team. The backfill script
 *  finds contracts removed from discovery; inactive contracts still present
 *  in discovery can also appear here. Only `critical: true` entries with
 *  mechanical or reviewed events are stored and consumed. */
interface OssificationJson {
  includeProjects?: string[]
  /** Contracts whose first recognized upgrade event changed an implementation
   *  that was already initialized. */
  firstUpgradeIsChange?: string[]
  /** Audited initialization/no-op upgrade transactions, keyed by contract. */
  ignoredUpgradeTransactions?: Record<string, string[]>
  /** Reviewed events missing from mechanical discovery history. */
  criticalEvents?: OssificationCriticalEvent[]
  historicalContracts?: {
    address?: string
    name?: string
    critical?: boolean | null
    upgradeTimestamps?: number[]
  }[]
}

/**
 * The ossification factor is computed only for projects that opted in by
 * committing an ossification.json, and only over contracts the research
 * team flagged `critical` in discovery (template default, config.jsonc
 * override). There is no derived fallback — unclassified projects have
 * no ossification factor.
 */
export async function getProjectOssification(
  projectId: string,
): Promise<ProjectOssification | undefined> {
  if (!PROJECT_ID_RE.test(projectId)) {
    return undefined
  }
  const ossificationJson = readProjectJson(projectId, 'ossification.json') as
    | OssificationJson
    | undefined
  if (ossificationJson === undefined) {
    return undefined
  }

  const projectIds = [
    ...new Set([
      projectId,
      ...(ossificationJson.includeProjects ?? []).filter((id) =>
        PROJECT_ID_RE.test(id),
      ),
    ]),
  ]
  const critical: (DiscoveredEntryLite & { address: string })[] = []
  const updates: DiscoveryUpdate[] = []
  for (const id of projectIds) {
    const discovered = readProjectJson(id, 'discovered.json') as
      | { entries?: DiscoveredEntryLite[] }
      | undefined
    critical.push(
      ...(discovered?.entries ?? []).filter(
        (entry): entry is DiscoveredEntryLite & { address: string } =>
          entry.type === 'Contract' &&
          entry.address !== undefined &&
          entry.critical === true,
      ),
    )
    updates.push(...getDiscoveryUpdates(id, Number.POSITIVE_INFINITY))
  }
  if (critical.length === 0) {
    return undefined
  }

  const historical = (ossificationJson.historicalContracts ?? []).flatMap(
    (contract) => {
      if (contract.critical !== true || !contract.address) return []
      return [
        {
          address: contract.address,
          name: contract.name ?? contract.address,
          upgradeTimestamps: deduplicateUpgradeTimestamps(
            contract.upgradeTimestamps ?? [],
          ),
        },
      ]
    },
  )

  const firstUpgradeIsChange = new Set(
    (ossificationJson.firstUpgradeIsChange ?? []).map((address) =>
      address.toLowerCase(),
    ),
  )
  const ignoredUpgradeTransactions = new Map(
    Object.entries(ossificationJson.ignoredUpgradeTransactions ?? {}).map(
      ([address, transactions]) => [
        address.toLowerCase(),
        new Set(transactions.map((transaction) => transaction.toLowerCase())),
      ],
    ),
  )
  const now = UnixTime.now()
  const factor = getOssificationFactor(
    critical.map((entry) =>
      toOssificationContractInput(
        entry,
        firstUpgradeIsChange,
        ignoredUpgradeTransactions,
      ),
    ),
    updates,
    now,
    historical,
    ossificationJson.criticalEvents ?? [],
  )
  if (factor === undefined) {
    return undefined
  }

  const from = now - TIMELINE_WINDOW_SECONDS
  const series = await getTvsSeries(
    projectId,
    factor.projectClockStart,
    from,
    now,
  )
  return {
    ...factor,
    exposure: getExposure(series, factor, now),
    timeline: {
      from,
      to: now,
      clockStart: factor.projectClockStart,
      resets: factor.perimeterResets.filter((reset) => reset >= from),
      tvs: series && sampleSeries(series, from, now),
    },
  }
}

function toOssificationContractInput(
  entry: DiscoveredEntryLite & { address: string },
  firstUpgradeIsChange: Set<string>,
  ignoredUpgradeTransactions: Map<string, Set<string>>,
): OssificationContractInput {
  return {
    address: entry.address,
    name: entry.name ?? entry.address,
    isVerified: entry.unverified !== true,
    sinceTimestamp: entry.sinceTimestamp,
    upgradeTimestamps: parseUpgradeTimestamps(
      entry.values?.$pastUpgrades,
      ignoredUpgradeTransactions.get(entry.address.toLowerCase()),
    ),
    firstUpgradeIsInitialization: !firstUpgradeIsChange.has(
      entry.address.toLowerCase(),
    ),
  }
}

/** One query serves both consumers: the exposure integral reaches back to the
 *  clock start, the timeline only needs the trailing window. Whichever is
 *  older sets the range. */
async function getTvsSeries(
  projectId: string,
  clockStart: number | null,
  from: number,
  to: number,
): Promise<BattleTestedExposurePoint[] | null> {
  if (env.MOCK) return null

  const repository = getDb().tvsTokenValue
  const anchor = Math.min(from, clockStart ?? from)
  // A sample at or before the anchor lets both consumers start from a known
  // value instead of the first in-range one.
  const precedingTimestamp =
    await repository.getMaxTimestampAtOrBeforeForProjects(UnixTime(anchor), [
      projectId,
    ])
  const rows = await repository.getSummedByTimestampByProjects(
    [projectId],
    precedingTimestamp ?? UnixTime(anchor),
    UnixTime(to),
    {
      forSummary: false,
      excludeAssociatedTokens: false,
      excludeRwaRestrictedTokens: false,
    },
  )
  // The query does not order its rows; both consumers below assume ascending.
  return rows
    .map((row) => ({
      timestamp: Number(row.timestamp),
      value: Number(row.value),
    }))
    .sort((a, b) => a.timestamp - b.timestamp)
}

/** ∫ TVS dt from the project clock start to now, in USD·years. Shares the
 * unverified gate with the score: an unverified perimeter accumulates
 * nothing. Samples before the clock start are clipped by the integral. */
function getExposure(
  series: BattleTestedExposurePoint[] | null,
  factor: OssificationFactor,
  now: number,
): number | null {
  const clockStart = factor.projectClockStart
  if (series === null || clockStart === null) return null
  if (factor.maturity === 0) return 0
  return calculateBattleTestedExposure(series, clockStart, now)
}

/** Point-in-time samples on a fixed grid: the last known value at each grid
 *  timestamp, or null while the series has not started. */
function sampleSeries(
  series: readonly BattleTestedExposurePoint[],
  from: number,
  to: number,
): (number | null)[] | null {
  const step = (to - from) / (TIMELINE_SAMPLES - 1)
  const values: (number | null)[] = []
  let cursor = 0
  let current: number | null = null
  for (let index = 0; index < TIMELINE_SAMPLES; index++) {
    const at = from + index * step
    while (cursor < series.length) {
      const point = series[cursor]
      if (point === undefined || point.timestamp > at) break
      current = point.value
      cursor++
    }
    values.push(current)
  }
  return values.some((value) => value !== null) ? values : null
}

function readProjectJson(projectId: string, file: string): unknown | undefined {
  const filePath = path.join(
    process.cwd(),
    '../config/src/projects',
    projectId,
    file,
  )
  if (!existsSync(filePath)) {
    return undefined
  }

  const mtimeMs = statSync(filePath).mtimeMs
  const cached = fileCache.get(filePath)
  if (cached && cached.mtimeMs === mtimeMs) {
    return cached.parsed
  }

  const parsed: unknown = JSON.parse(readFileSync(filePath, 'utf-8'))
  fileCache.set(filePath, { mtimeMs, parsed })
  return parsed
}
