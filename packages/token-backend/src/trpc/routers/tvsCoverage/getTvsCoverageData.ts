import { INTEROP_CHAINS, type Project, ProjectService } from '@l2beat/config'
import type { Database, TokenDatabase } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import {
  aggregateInteropDeploymentStats,
  attachInteropRoles,
  buildCoverage,
  type CoverageRow,
  collectProjectTvsDeployments,
  type ProjectTvsDeployment,
  type TvsProjectInput,
} from './model'

export interface TvsCoverageData {
  generatedAt: number
  window: {
    hours: number
    from: number
    to: number
  }
  chains: {
    chain: string
    chainName: string
    projectName: string | undefined
    projectIconUrl: string | undefined
    explorerUrl: string | undefined
    interopVolumeUsd: number
  }[]
  plugins: {
    id: string
    name: string
    iconUrl: string | undefined
  }[]
  tvsDeployments: ProjectTvsDeployment[]
  rows: CoverageRow[]
}

const projectService = new ProjectService()

export async function getTvsCoverageData(
  db: Database,
  tokenDb: TokenDatabase,
  hours: number,
): Promise<TvsCoverageData> {
  const to = UnixTime.now()
  const from = UnixTime(to - hours * UnixTime.HOUR)
  const [
    deploymentStats,
    deployedTokens,
    abstractTokens,
    tokenRelations,
    projects,
    interopProjects,
  ] = await Promise.all([
    db.interopTransfer.getDeploymentStatsByRange(from, to),
    tokenDb.deployedToken.getAll(),
    tokenDb.abstractToken.getAll(),
    tokenDb.tokenRelation.getAllRoutes(),
    projectService.getProjects({
      select: ['chainConfig'],
      optional: ['tvsConfig'],
    }),
    projectService.getProjects({ select: ['interopConfig'] }),
  ])

  const projectInputs: TvsProjectInput[] = projects.map((project) => ({
    projectName: project.name,
    projectIconUrl: `https://l2beat.com/icons/${project.slug}.png`,
    chain: project.chainConfig.name,
    explorerUrl: project.chainConfig.explorerUrl,
    tokens: project.tvsConfig,
  }))
  const rows = attachInteropRoles(
    buildCoverage(
      aggregateInteropDeploymentStats(
        deploymentStats,
        deployedTokens,
        abstractTokens,
      ),
      projectInputs,
      deployedTokens,
    ),
    tokenRelations,
  )

  return {
    generatedAt: UnixTime.now(),
    window: { hours, from, to },
    chains: buildChains(rows, projectInputs),
    plugins: buildPlugins(rows, interopProjects),
    tvsDeployments: collectProjectTvsDeployments(projectInputs),
    rows,
  }
}

function buildPlugins(
  rows: CoverageRow[],
  projects: Project<'interopConfig'>[],
) {
  const observedPlugins = new Set(rows.flatMap((row) => row.plugins))

  return Array.from(observedPlugins, (id) => {
    const candidates = projects.filter((project) =>
      project.interopConfig.plugins.some((plugin) => plugin.plugin === id),
    )
    const project =
      candidates.find((candidate) =>
        candidate.interopConfig.plugins.some(
          (plugin) =>
            plugin.plugin === id &&
            plugin.chain === undefined &&
            plugin.abstractTokenId === undefined,
        ),
      ) ?? candidates[0]

    return {
      id,
      name: project?.interopConfig.name ?? project?.name ?? id,
      iconUrl: project
        ? `https://l2beat.com/icons/${project.slug}.png`
        : undefined,
    }
  }).sort((a, b) => a.name.localeCompare(b.name))
}

function buildChains(rows: CoverageRow[], projects: TvsProjectInput[]) {
  const detailsByChain = new Map(
    INTEROP_CHAINS.map((chain) => [chain.id, chain]),
  )
  const projectsByChain = new Map(
    projects.map((project) => [project.chain, project]),
  )
  const volumeByChain = new Map<string, number>()

  for (const row of rows) {
    volumeByChain.set(
      row.chain,
      (volumeByChain.get(row.chain) ?? 0) + row.volumeUsd,
    )
  }

  return Array.from(volumeByChain, ([chain, interopVolumeUsd]) => {
    const project = projectsByChain.get(chain)
    return {
      chain,
      chainName: detailsByChain.get(chain)?.name ?? chain,
      projectName: project?.projectName,
      projectIconUrl: project?.projectIconUrl,
      explorerUrl: project?.explorerUrl,
      interopVolumeUsd,
    }
  }).sort(
    (a, b) =>
      b.interopVolumeUsd - a.interopVolumeUsd || a.chain.localeCompare(b.chain),
  )
}
