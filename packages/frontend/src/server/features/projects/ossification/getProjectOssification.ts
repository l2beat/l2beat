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
  getOssificationFactor,
  type OssificationEntry,
  type OssificationFactor,
} from './getOssificationFactor'
import type { DiscoveredEntryLite } from './getOssificationPerimeter'
import {
  deduplicateUpgradeTimestamps,
  parseUpgradeTimestamps,
} from './parseUpgradeTimestamps'

const PROJECT_ID_RE = /^[a-z0-9-]+$/i
const SECONDS_PER_YEAR = 365 * 24 * 60 * 60

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
 *  `historicalContracts`: contracts that once were critical but have been
 *  removed from discovery, classified by the research team (see
 *  scripts/ossification-backfill.ts). Only entries with countable events are
 *  stored; only `critical: true` ones are consumed. */
interface OssificationJson {
  includeProjects?: string[]
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

  const historical = (ossificationJson.historicalContracts ?? [])
    .filter((contract) => contract.critical === true && contract.address)
    .map((contract) => ({
      address: contract.address as string,
      name: contract.name ?? (contract.address as string),
      upgradeTimestamps: deduplicateUpgradeTimestamps(
        contract.upgradeTimestamps ?? [],
      ),
    }))

  const factor = getOssificationFactor(
    critical.map(toOssificationEntry),
    updates,
    UnixTime.now(),
    historical,
  )
  if (factor === undefined) {
    return undefined
  }

  return { ...factor, exposure: await getExposure(projectId, factor) }
}

function toOssificationEntry(
  entry: DiscoveredEntryLite & { address: string },
): OssificationEntry {
  return {
    address: entry.address,
    name: entry.name ?? entry.address,
    isVerified: entry.unverified !== true,
    sinceTimestamp: entry.sinceTimestamp,
    upgradeTimestamps: parseUpgradeTimestamps(entry.values?.$pastUpgrades),
  }
}

/** ∫ TVS dt from the project clock start to now (trapezoid over the daily
 *  series, flat-extended to now), in USD·years. Shares the unverified gate
 *  with the score: an unverified perimeter accumulates nothing. */
async function getExposure(
  projectId: string,
  factor: OssificationFactor,
): Promise<number | null> {
  if (env.MOCK || factor.projectClockStart === null) return null
  if (factor.maturity === 0) return 0

  const now = UnixTime.now()
  const series = await getDb().tvsTokenValue.getSummedByTimestampByProjects(
    [projectId],
    UnixTime(factor.projectClockStart),
    UnixTime(now),
    {
      forSummary: false,
      excludeAssociatedTokens: false,
      excludeRwaRestrictedTokens: false,
    },
  )
  const points = series
    .map((row) => ({ t: Number(row.timestamp), v: Number(row.value) }))
    .filter((point) => Number.isFinite(point.v))
    .sort((a, b) => a.t - b.t)
  if (points.length === 0) return null

  let integral = 0
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]
    const b = points[i]
    if (!a || !b) continue
    integral += ((a.v + b.v) / 2) * (b.t - a.t)
  }
  const last = points.at(-1)
  if (last && now > last.t) {
    integral += last.v * (now - last.t)
  }
  return integral / SECONDS_PER_YEAR
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

  try {
    const parsed: unknown = JSON.parse(readFileSync(filePath, 'utf-8'))
    fileCache.set(filePath, { mtimeMs, parsed })
    return parsed
  } catch {
    return undefined
  }
}
