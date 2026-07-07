import type { Project } from '@l2beat/config'
import { manifest } from '~/utils/Manifest'

export type DefiProject = Project<
  'display' | 'defiInfo' | 'statuses',
  'contracts' | 'permissions' | 'discoveryInfo'
>

export interface DefiSummaryEntry {
  id: string
  slug: string
  name: string
  shortName: string | undefined
  icon: string
  href: string
  description: string
  category: string
  isUnderReview: boolean
}

export function getDefiSummaryEntries(
  projects: DefiProject[],
): DefiSummaryEntry[] {
  return projects
    .map(
      (project): DefiSummaryEntry => ({
        id: project.id,
        slug: project.slug,
        name: project.name,
        shortName: project.shortName,
        icon: manifest.getUrl(`/icons/${project.slug}.png`),
        href: `/defi/projects/${project.slug}`,
        description: project.display.description,
        category: project.defiInfo.category,
        isUnderReview: !!project.statuses.reviewStatus,
      }),
    )
    .sort((a, b) => a.name.localeCompare(b.name))
}
