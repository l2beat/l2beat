import type { ProjectService } from '@l2beat/config'
import type { Database, TokenDatabase } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import {
  type ChainReader,
  estimateValues,
  type PriceSource,
  type RowValue,
  rowKey,
} from './estimateValues'
import { buildCoverage, type CoverageRow, type TvsProjectInput } from './model'

export interface TvsCoverageSnapshot {
  generatedAt: number
  durationMs: number
  window: { days: number; from: number; to: number }
  projects: {
    id: string
    name: string
    iconUrl: string
    chain: string | undefined
  }[]
  chains: { name: string; explorerUrl: string | undefined }[]
  bridges: { id: string; name: string; iconUrl: string }[]
  rows: (CoverageRow & { value: RowValue | undefined })[]
  warnings: string[]
}

export interface SnapshotDeps {
  db: Database
  tokenDb: TokenDatabase
  projectService: ProjectService
  createChainReader: (rpcUrls: Map<string, string>) => ChainReader
  prices: PriceSource
}

export async function buildSnapshot(
  deps: SnapshotDeps,
  days: number,
): Promise<TvsCoverageSnapshot> {
  const startedAt = Date.now()
  const to = UnixTime.now()
  const from = UnixTime(to - days * UnixTime.DAY)
  const [
    stats,
    deployedTokens,
    abstractTokens,
    relations,
    chainRecords,
    tvsProjects,
    chainProjects,
    interopProjects,
  ] = await Promise.all([
    deps.db.aggregatedInteropDeployedToken.getDailyStatsSince(from),
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

  const projects: TvsProjectInput[] = tvsProjects.map((project) => ({
    id: project.id,
    name: project.name,
    chain: project.chainConfig?.name,
    plugins: (project.interopConfig?.plugins ?? []).map(
      (plugin) => plugin.plugin,
    ),
    tokens: project.tvsConfig,
  }))
  const coverage = buildCoverage({
    stats,
    projects,
    deployedTokens,
    abstractTokens,
    relations,
    timestamp: to,
  })

  const rpcUrls = new Map(
    chainRecords.flatMap((chain) => {
      const rpc = chain.apis?.find((api) => api.type === 'rpc')
      return rpc ? [[chain.name, rpc.url] as const] : []
    }),
  )
  const { values, warnings } = await estimateValues(
    coverage,
    deps.createChainReader(rpcUrls),
    deps.prices,
  )

  const bridgeIds = new Set(
    coverage.rows.flatMap((row) => row.bridges.map((bridge) => bridge.id)),
  )
  return {
    generatedAt: to,
    durationMs: Date.now() - startedAt,
    window: { days, from, to },
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
      value: values.get(rowKey(row)),
    })),
    warnings,
  }
}

function iconUrl(slug: string) {
  return `https://l2beat.com/icons/${slug}.png`
}
