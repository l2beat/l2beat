import { UnixTime } from '@l2beat/shared-pure'
import { existsSync, readFileSync, statSync } from 'fs'
import path from 'path'
import { env } from '~/env'
import { getDb } from '~/server/database'
import {
  type DiscoveryUpdate,
  getDiscoveryUpdates,
} from '../recent-changes/getDiscoveryUpdates'
import { calculateBattleTestedExposure } from './calculateBattleTestedExposure'
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

const fileCache = new Map<string, { mtimeMs: number; parsed: unknown }>()

export interface ProjectOssification extends OssificationFactor {
  /** Project TVS integrated over the current unchanged period, in USD·years. */
  exposure: number | null
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
  const factor = getOssificationFactor(
    critical.map((entry) =>
      toOssificationContractInput(
        entry,
        firstUpgradeIsChange,
        ignoredUpgradeTransactions,
      ),
    ),
    updates,
    UnixTime.now(),
    historical,
    ossificationJson.criticalEvents ?? [],
  )
  if (factor === undefined) {
    return undefined
  }

  return { ...factor, exposure: await getExposure(projectId, factor) }
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

/** ∫ TVS dt from the project clock start to now, in USD·years. Shares the
 * unverified gate with the score: an unverified perimeter accumulates
 * nothing. */
async function getExposure(
  projectId: string,
  factor: OssificationFactor,
): Promise<number | null> {
  const clockStart = factor.projectClockStart
  if (env.MOCK || clockStart === null) return null
  if (factor.maturity === 0) return 0

  const now = UnixTime.now()
  const repository = getDb().tvsTokenValue
  const precedingTimestamp =
    await repository.getMaxTimestampAtOrBeforeForProjects(
      UnixTime(clockStart),
      [projectId],
    )
  const series = await repository.getSummedByTimestampByProjects(
    [projectId],
    precedingTimestamp ?? UnixTime(clockStart),
    UnixTime(now),
    {
      forSummary: false,
      excludeAssociatedTokens: false,
      excludeRwaRestrictedTokens: false,
    },
  )
  return calculateBattleTestedExposure(
    series.map((row) => ({
      timestamp: Number(row.timestamp),
      value: Number(row.value),
    })),
    clockStart,
    now,
  )
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
