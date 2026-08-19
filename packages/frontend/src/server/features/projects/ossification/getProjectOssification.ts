import { UnixTime } from '@l2beat/shared-pure'
import { existsSync, readFileSync, statSync } from 'fs'
import path from 'path'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getTvsTargetTimestamp } from '../../scaling/tvs/utils/getTvsTargetTimestamp'
import { getDiscoveryUpdates } from '../recent-changes/getDiscoveryUpdates'
import {
  getOssificationFactor,
  type OssificationEntry,
  type OssificationFactor,
} from './getOssificationFactor'
import type { DiscoveredEntryLite } from './getOssificationPerimeter'

const PROJECT_ID_RE = /^[a-z0-9-]+$/i

const fileCache = new Map<string, { mtimeMs: number; parsed: unknown }>()

/**
 * The ossification factor is computed only for projects that opted in by
 * committing an ossification.json, and only over contracts the research
 * team flagged `critical` in discovery (template default, config.jsonc
 * override). There is no derived fallback — unclassified projects have
 * no ossification factor.
 */
/** Committed judgment file. `historicalContracts` holds contracts that once
 *  were critical but have been removed from discovery, classified by the
 *  research team (see scripts/ossification-backfill.ts). Only entries with
 *  countable events are stored; only `critical: true` ones are consumed. */
interface OssificationJson {
  historicalContracts?: {
    address?: string
    name?: string
    critical?: boolean | null
    upgradeTimestamps?: number[]
  }[]
}

export async function getProjectOssification(
  projectId: string,
): Promise<OssificationFactor | undefined> {
  if (!PROJECT_ID_RE.test(projectId)) {
    return undefined
  }
  const ossificationJson = readProjectJson(projectId, 'ossification.json') as
    | OssificationJson
    | undefined
  if (ossificationJson === undefined) {
    return undefined
  }

  const discovered = readProjectJson(projectId, 'discovered.json') as
    | { entries?: DiscoveredEntryLite[] }
    | undefined
  const critical = (discovered?.entries ?? []).filter(
    (entry): entry is DiscoveredEntryLite & { address: string } =>
      entry.type === 'Contract' &&
      entry.address !== undefined &&
      entry.critical === true,
  )
  if (critical.length === 0) {
    return undefined
  }

  const currentTvs = await getCurrentProjectTvs(projectId)
  const historical = (ossificationJson.historicalContracts ?? [])
    .filter((contract) => contract.critical === true && contract.address)
    .map((contract) => ({
      address: contract.address as string,
      name: contract.name ?? (contract.address as string),
      upgradeTimestamps: contract.upgradeTimestamps ?? [],
    }))

  return getOssificationFactor(
    critical.map(toOssificationEntry),
    getDiscoveryUpdates(projectId, Number.POSITIVE_INFINITY),
    UnixTime.now(),
    currentTvs,
    historical,
  )
}

function toOssificationEntry(
  entry: DiscoveredEntryLite & { address: string },
): OssificationEntry {
  return {
    address: entry.address,
    name: entry.name ?? entry.address,
    isVerified: entry.unverified !== true,
    sinceTimestamp: entry.sinceTimestamp,
    upgradeTimestamps: parsePastUpgrades(entry.values?.$pastUpgrades),
  }
}

async function getCurrentProjectTvs(
  projectId: string,
): Promise<number | undefined> {
  if (env.MOCK) return undefined

  const tokenValues = await getDb().tvsTokenValue.getByProjectAtOrBefore(
    projectId,
    getTvsTargetTimestamp(),
  )
  if (tokenValues.length === 0) return undefined

  return tokenValues.reduce(
    (sum, tokenValue) => sum + tokenValue.valueForProject,
    0,
  )
}

function parsePastUpgrades(value: unknown): number[] {
  if (!Array.isArray(value)) return []
  const timestamps: number[] = []
  for (const upgrade of value) {
    if (!Array.isArray(upgrade) || typeof upgrade[0] !== 'string') continue
    const timestamp = Date.parse(upgrade[0])
    if (Number.isFinite(timestamp)) {
      timestamps.push(Math.floor(timestamp / 1000))
    }
  }
  return timestamps.sort((a, b) => a - b)
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
