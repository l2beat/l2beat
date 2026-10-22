import type { Project } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ResolvedCrops } from '~/components/garden/crops'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getTotalValueLockedByProject } from '~/server/features/defi/getDefiSummaryEntries'
import { getAttestationsMeta } from '~/server/features/garden/getAttestationsMeta'
import { getGardenProjectPath } from '~/server/features/garden/getGardenProjectPath'
import { withOssification } from '~/server/features/garden/withOssification'
import type { SevenDayTvsBreakdown } from '~/server/features/layer2s/tvs/get7dTvsBreakdown'
import { get7dTvsBreakdown } from '~/server/features/layer2s/tvs/get7dTvsBreakdown'
import { getProjectOssification } from '~/server/features/projects/ossification/getProjectOssification'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

/** Editorial order of the garden table. Reviewed projects not named here follow alphabetically. */
const GARDEN_ORDER: ProjectId[] = [
  ProjectId('tornado-cash'),
  ProjectId('aztecnetwork'),
  ProjectId('umbra'),
  ProjectId('uniswapv3'),
]

export interface GardenMetric {
  kind: 'usd' | 'count'
  label: string
  value: number
  /** Ratio, e.g. 0.0124 for +1.24%. */
  change?: number
}

export interface GardenEntry {
  name: string
  slug: string
  /** Null for a project without a page. */
  href: string | null
  subtitle: string
  iconUrl: string
  crops: ResolvedCrops
  /** Undefined when we track nothing for the project. */
  metric: GardenMetric | undefined
}

type GardenProject = Project<
  'garden',
  | 'scalingInfo'
  | 'privacyInfo'
  | 'defiInfo'
  | 'daLayer'
  | 'ossificationHistory'
  | 'scalingRisks'
  | 'tvsConfig'
>

export async function getGardenData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const reviewed = await ps.getProjects({
    where: ['garden'],
    select: ['garden'],
    optional: [
      'scalingInfo',
      'privacyInfo',
      'defiInfo',
      'daLayer',
      'ossificationHistory',
      'scalingRisks',
      'tvsConfig',
    ],
  })
  const projects = reviewed
    .filter((project) => project.garden.listing === 'listed')
    .sort(compareByCuratedOrder)

  const [tvsBreakdown, depositCounts, defiTvl] = await Promise.all([
    get7dTvsBreakdown({
      type: 'projects',
      projectIds: projects.map((p) => p.id),
    }),
    getTotalDepositCounts(
      projects.filter((p) => p.privacyInfo).map((p) => p.id),
    ),
    getTotalValueLockedByProject(
      projects.flatMap((p) =>
        p.defiInfo ? [{ id: p.id, defiInfo: p.defiInfo }] : [],
      ),
    ),
  ])

  const entries: GardenEntry[] = await Promise.all(
    projects.map(async (project) => ({
      name: project.name,
      slug: project.slug,
      href: getGardenProjectPath(project),
      subtitle: getSubtitle(project),
      iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
      // One value-series read per listed project, as on the ossification
      // page. The garden lists a handful, so it is not worth a batched query.
      crops: withOssification(
        project.garden.crops,
        await getProjectOssification(project),
      ),
      metric: getMetric(project, tvsBreakdown, depositCounts, defiTvl),
    })),
  )

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: 'The Infinite Garden',
        description:
          'How projects rate on the four CROPS properties: censorship resistance, open source, privacy, and security.',
        url,
        openGraph: {
          image: '/meta-images/the-infinite-garden/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'GardenPage',
      props: {
        ...(await getAppLayoutProps()),
        entries,
        attestation: getAttestationsMeta().current,
      },
    },
  }
}

function compareByCuratedOrder(
  a: { id: ProjectId; name: string },
  b: { id: ProjectId; name: string },
): number {
  const aIndex = GARDEN_ORDER.indexOf(a.id)
  const bIndex = GARDEN_ORDER.indexOf(b.id)
  if (aIndex !== -1 && bIndex !== -1) {
    return aIndex - bIndex
  }
  if (aIndex !== -1) return -1
  if (bIndex !== -1) return 1
  return a.name.localeCompare(b.name)
}

/** All-time deposit count per privacy project. Only projects with recorded flows come back. */
async function getTotalDepositCounts(
  projectIds: string[],
): Promise<Record<string, number>> {
  if (projectIds.length === 0) {
    return {}
  }
  if (env.MOCK) {
    return Object.fromEntries(projectIds.map((id) => [id, 12_345]))
  }
  const rows =
    await getDb().privacyFlowEvent.getBucketTotalsByProjectIds(projectIds)
  const counts: Record<string, number> = {}
  for (const row of rows) {
    counts[row.projectId] = (counts[row.projectId] ?? 0) + row.depositCount
  }
  return counts
}

// Value secured where tracked, by L2BEAT or, for DeFi, the TVL source the
// DeFi pages use; otherwise the deposit count, for a privacy protocol whose
// payments are forwarded rather than escrowed.
function getMetric(
  project: GardenProject,
  tvsBreakdown: SevenDayTvsBreakdown,
  depositCounts: Record<string, number>,
  defiTvl: ReadonlyMap<string, number>,
): GardenMetric | undefined {
  const tvs = tvsBreakdown.projects[project.id]
  if (tvs) {
    return {
      kind: 'usd',
      label: project.scalingInfo ? 'TVS' : 'TVL',
      value: tvs.breakdown.total,
      change: tvs.change.total,
    }
  }
  const tvl = defiTvl.get(project.id)
  if (tvl !== undefined) {
    return { kind: 'usd', label: 'TVL', value: tvl }
  }
  const deposits = depositCounts[project.id]
  if (deposits !== undefined) {
    return { kind: 'count', label: 'Total deposits', value: deposits }
  }
  return undefined
}

function getSubtitle(project: GardenProject): string {
  if (project.scalingInfo?.type) {
    return project.scalingInfo.purposes.includes('Privacy')
      ? `Privacy ${project.scalingInfo.type}`
      : project.scalingInfo.type
  }
  if (project.privacyInfo) {
    return 'Privacy protocol'
  }
  if (project.defiInfo) {
    return project.defiInfo.category
  }
  return isBaseLayer(project) ? 'Layer 1' : 'Protocol'
}

function isBaseLayer(project: GardenProject): boolean {
  return !project.scalingInfo && project.daLayer !== undefined
}
