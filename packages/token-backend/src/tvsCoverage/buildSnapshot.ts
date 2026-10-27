import type { ProjectService } from '@l2beat/config'
import type { ChainRecord, Database, TokenDatabase } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import {
  Coverage,
  type CoverageRow,
  type CoverageStatus,
  type TvsProjectInput,
} from './coverage'
import {
  type ChainReader,
  estimateValues,
  type PriceSource,
  type RowValue,
  rowKey,
} from './estimateValues'

export interface TvsCoverageSnapshot {
  generatedAt: number
  // The interop data: `days` daily snapshots covering `from` until `to`.
  window: { days: number; from: number; to: number }
  projects: {
    id: string
    name: string
    iconUrl: string
    chain: string | undefined
  }[]
  chains: { name: string; explorerUrl: string | undefined }[]
  bridges: { id: string; name: string; iconUrl: string }[]
  rows: (CoverageRow & {
    value: RowValue | undefined
    escrowAddresses: string[]
  })[]
  warnings: string[]
}

export interface SnapshotStats {
  durationMs: number
  loadMs: number
  estimateMs: number
  days: number
  rows: number
  statuses: Partial<Record<CoverageStatus, number>>
  estimatedRows: number
  chainCalls: number
  coingeckoIds: number
  warnings: number
  payloadBytes: number
}

export interface SnapshotDeps {
  db: Database
  tokenDb: TokenDatabase
  projectService: ProjectService
  createChainReader: (chains: ChainRecord[]) => ChainReader
  prices: PriceSource
}

export async function buildSnapshot(
  deps: SnapshotDeps,
  windowDays: number,
): Promise<{ snapshot: TvsCoverageSnapshot; stats: SnapshotStats }> {
  const startedAt = Date.now()
  const generatedAt = UnixTime.now()
  const days =
    await deps.db.interopAggregateStatus.getPromotedMidnightTimestampsSince(
      UnixTime(
        UnixTime.toStartOf(generatedAt, 'day') -
          (windowDays - 1) * UnixTime.DAY,
      ),
    )
  const [
    stats,
    deployedTokens,
    abstractTokens,
    relations,
    chains,
    tvsProjects,
    chainProjects,
    interopProjects,
  ] = await Promise.all([
    deps.db.aggregatedInteropDeployedToken.getSummedByTimestamps(days),
    deps.tokenDb.deployedToken.getAll(),
    deps.tokenDb.abstractToken.getAll(),
    deps.tokenDb.tokenRelation.getAllRoutes(),
    deps.tokenDb.chain.getAll(),
    deps.projectService.getProjects({
      select: ['tvsConfig'],
      optional: ['chainConfig', 'interopConfig'],
    }),
    deps.projectService.getProjects({ select: ['chainConfig'] }),
    deps.projectService.getProjects({ select: ['interopConfig'] }),
  ])
  const loadMs = Date.now() - startedAt

  const coverage = new Coverage({
    stats,
    projects: tvsProjects.map(
      (project): TvsProjectInput => ({
        id: project.id,
        name: project.name,
        chain: project.chainConfig?.name,
        plugins: project.interopConfig?.plugins ?? [],
        tokens: project.tvsConfig,
      }),
    ),
    deployedTokens,
    abstractTokens,
    relations,
    timestamp: generatedAt,
  })
  const estimateStartedAt = Date.now()
  const estimates = await estimateValues(
    coverage,
    deps.createChainReader(chains),
    deps.prices,
  )
  const estimateMs = Date.now() - estimateStartedAt

  const bridgeIds = new Set(
    coverage.rows.flatMap((row) => row.bridges.map((bridge) => bridge.id)),
  )
  const firstDay = days[0] ?? generatedAt
  const snapshot: TvsCoverageSnapshot = {
    generatedAt,
    window: {
      days: days.length,
      from: firstDay - UnixTime.DAY,
      to: days.at(-1) ?? generatedAt,
    },
    projects: tvsProjects.map((project) => ({
      id: project.id,
      name: project.name,
      iconUrl: iconUrl(project.slug),
      chain: project.chainConfig?.name,
    })),
    chains: chainProjects.map((project) => ({
      name: project.chainConfig.name,
      explorerUrl: project.chainConfig.explorerUrl,
    })),
    bridges: interopProjects
      .filter((project) => bridgeIds.has(project.id))
      .map((project) => ({
        id: project.id,
        name: project.interopConfig.name ?? project.name,
        iconUrl: iconUrl(project.slug),
      })),
    rows: coverage.rows.map((row) => ({
      ...row,
      value: estimates.values.get(rowKey(row)),
      escrowAddresses:
        row.side === 'escrow'
          ? coverage.escrowAddresses(row.projectId, row.chain)
          : [],
    })),
    warnings: estimates.warnings,
  }

  return {
    snapshot,
    stats: {
      durationMs: Date.now() - startedAt,
      loadMs,
      estimateMs,
      days: days.length,
      rows: snapshot.rows.length,
      statuses: countBy(snapshot.rows, (row) => row.status),
      estimatedRows: estimates.stats.rows,
      chainCalls: estimates.stats.chainCalls,
      coingeckoIds: estimates.stats.coingeckoIds,
      warnings: snapshot.warnings.length,
      payloadBytes: Buffer.byteLength(JSON.stringify(snapshot)),
    },
  }
}

function iconUrl(slug: string) {
  return `https://l2beat.com/icons/${slug}.png`
}

function countBy<T, K extends string>(
  items: T[],
  getKey: (item: T) => K,
): Partial<Record<K, number>> {
  const counts: Partial<Record<K, number>> = {}
  for (const item of items) {
    const key = getKey(item)
    counts[key] = (counts[key] ?? 0) + 1
  }
  return counts
}
