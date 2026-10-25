import { ProjectService } from '@l2beat/config'
import type { Database, TokenDatabase } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { buildCoverage, type CoverageRow, type TvsProjectInput } from './model'

export interface TvsCoverageData {
  generatedAt: number
  window: { days: number; from: number; to: number }
  projects: {
    id: string
    name: string
    iconUrl: string
    chain: string | undefined
  }[]
  chains: { name: string; explorerUrl: string | undefined }[]
  bridges: { id: string; name: string; iconUrl: string }[]
  rows: CoverageRow[]
}

const projectService = new ProjectService()

export async function getTvsCoverageData(
  db: Database,
  tokenDb: TokenDatabase,
  days: number,
): Promise<TvsCoverageData> {
  const to = UnixTime.now()
  const from = UnixTime(to - days * UnixTime.DAY)
  const [
    stats,
    deployedTokens,
    abstractTokens,
    relations,
    tvsProjects,
    chainProjects,
    interopProjects,
  ] = await Promise.all([
    db.aggregatedInteropDeployedToken.getDailyStatsSince(from),
    tokenDb.deployedToken.getAll(),
    tokenDb.abstractToken.getAll(),
    tokenDb.tokenRelation.getAllRoutes(),
    projectService.getProjects({
      select: ['tvsConfig'],
      optional: ['chainConfig', 'interopConfig'],
    }),
    projectService.getProjects({ select: ['chainConfig'] }),
    projectService.getProjects({ select: ['interopConfig'] }),
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
  const rows = buildCoverage({
    stats,
    projects,
    deployedTokens,
    abstractTokens,
    relations,
    timestamp: to,
  })

  const bridgeIds = new Set(rows.flatMap((row) => row.bridges.map((b) => b.id)))
  return {
    generatedAt: to,
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
    rows,
  }
}

function iconUrl(slug: string) {
  return `https://l2beat.com/icons/${slug}.png`
}
