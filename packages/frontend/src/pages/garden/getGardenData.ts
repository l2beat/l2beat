import type { Project, ProjectCrops } from '@l2beat/config'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { SevenDayTvsBreakdown } from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import { get7dTvsBreakdown } from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export type GardenProjectType = 'l2' | 'l3' | 'privacy'

export interface GardenMetric {
  label: 'TVS' | 'TVL'
  value: number
  change: number
}

export interface GardenEntry {
  name: string
  slug: string
  subtitle: string
  iconUrl: string
  types: GardenProjectType[]
  crops: ProjectCrops
  tvs: GardenMetric | undefined
}

export async function getGardenData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const projects = await ps.getProjects({
    where: ['crops'],
    select: ['crops'],
    optional: ['scalingInfo', 'privacyInfo'],
  })

  const tvsBreakdown = await getTvsBreakdown(projects.map((p) => p.id))

  const entries: GardenEntry[] = projects
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((project) => ({
      name: project.name,
      slug: project.slug,
      subtitle: getSubtitle(project),
      iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
      types: getTypes(project),
      crops: project.crops,
      tvs: getMetric(project, tvsBreakdown),
    }))

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'The Infinite Garden - L2BEAT',
        description:
          'A garden view of how projects grow across the CROPS framework: censorship resistance, open source, privacy, and security.',
        url,
        openGraph: {
          image: '/meta-images/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'GardenPage',
      props: {
        ...(await getAppLayoutProps()),
        entries,
      },
    },
  }
}

type GardenProject = Project<'crops', 'scalingInfo' | 'privacyInfo'>

async function getTvsBreakdown(
  projectIds: string[],
): Promise<SevenDayTvsBreakdown | undefined> {
  try {
    return await get7dTvsBreakdown({ type: 'projects', projectIds })
  } catch {
    // TVS lives in the postgres database, which may be unavailable locally.
    return undefined
  }
}

function getMetric(
  project: GardenProject,
  tvsBreakdown: SevenDayTvsBreakdown | undefined,
): GardenMetric | undefined {
  const tvs = tvsBreakdown?.projects[project.id]
  if (!tvs) {
    return undefined
  }
  return {
    label: project.scalingInfo ? 'TVS' : 'TVL',
    value: tvs.breakdown.total,
    change: tvs.change.total,
  }
}

function getSubtitle(project: GardenProject): string {
  if (project.scalingInfo?.type) {
    return project.scalingInfo.purposes.includes('Privacy')
      ? `Privacy ${project.scalingInfo.type}`
      : project.scalingInfo.type
  }
  return project.privacyInfo ? 'Privacy protocol' : 'Protocol'
}

function getTypes(project: GardenProject): GardenProjectType[] {
  const types: GardenProjectType[] = []
  if (project.scalingInfo) {
    types.push(project.scalingInfo.layer === 'layer3' ? 'l3' : 'l2')
  }
  if (
    project.privacyInfo ||
    project.scalingInfo?.purposes.includes('Privacy')
  ) {
    types.push('privacy')
  }
  return types
}
