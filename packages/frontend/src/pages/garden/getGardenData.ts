import type { Project } from '@l2beat/config'
import type { ResolvedCrops } from '@l2beat/config/build/crops/canonicalCrops'
import {
  qualifiesForGarden,
  resolveProjectCrops,
} from '@l2beat/config/build/crops/canonicalCrops'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getGardenAttestation } from '~/server/features/garden/getGardenAttestation'
import { getGardenProjectPath } from '~/server/features/garden/getGardenProjectPath'
import type { SevenDayTvsBreakdown } from '~/server/features/layer2s/tvs/get7dTvsBreakdown'
import { get7dTvsBreakdown } from '~/server/features/layer2s/tvs/get7dTvsBreakdown'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

// Editorial display order; anything else is appended alphabetically.
const CURATED_ORDER = ['tornado-cash', 'aztecnetwork', 'umbra', 'uniswapv3']

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
  /** Undefined for a project without a page. */
  href: string | undefined
  subtitle: string
  iconUrl: string
  crops: ResolvedCrops
  /** Undefined when we track nothing for the project. */
  metric: GardenMetric | undefined
}

type GardenProject = Project<
  'crops',
  'scalingInfo' | 'privacyInfo' | 'defiInfo' | 'daLayer'
>

export async function getGardenData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const projects = await ps.getProjects({
    where: ['crops'],
    select: ['crops'],
    optional: ['scalingInfo', 'privacyInfo', 'defiInfo', 'daLayer'],
  })

  const [tvsBreakdown, depositCounts] = await Promise.all([
    get7dTvsBreakdown({
      type: 'projects',
      projectIds: projects.map((p) => p.id),
    }),
    getTotalDepositCounts(
      projects.filter((p) => p.privacyInfo).map((p) => p.id),
    ),
  ])

  const entries: GardenEntry[] = projects
    .sort(compareByCuratedOrder)
    .map((project) => ({
      name: project.name,
      slug: project.slug,
      href: getGardenProjectPath(project),
      subtitle: getSubtitle(project),
      iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
      crops: resolveProjectCrops(project.crops),
      metric: getMetric(project, tvsBreakdown, depositCounts),
    }))
    .filter((entry) => qualifiesForGarden(entry.crops))

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'The Infinite Garden - L2BEAT',
        description:
          'A garden view of how projects grow across the CROPS framework: censorship resistance, open source, privacy, and security.',
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
        attestation: getGardenAttestation(),
      },
    },
  }
}

function compareByCuratedOrder(
  a: { slug: string; name: string },
  b: { slug: string; name: string },
): number {
  const aIndex = CURATED_ORDER.indexOf(a.slug)
  const bIndex = CURATED_ORDER.indexOf(b.slug)
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

// Value secured where tracked; otherwise the deposit count, for a privacy
// protocol whose payments are forwarded rather than escrowed.
function getMetric(
  project: GardenProject,
  tvsBreakdown: SevenDayTvsBreakdown,
  depositCounts: Record<string, number>,
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
