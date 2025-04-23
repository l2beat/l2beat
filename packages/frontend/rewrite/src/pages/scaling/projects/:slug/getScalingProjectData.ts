import type { Manifest } from 'rewrite/src/common/Manifest'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getSearchBarProjects } from '~/components/search-bar/search-bar-projects'
import { getCollection } from '~/content/get-collection'
import { getScalingProjectEntry } from '~/server/features/scaling/project/get-scaling-project-entry'

import { ps } from '~/server/projects'

export async function getScalingProjectData(
  manifest: Manifest,
  slug: string,
): Promise<RenderData | undefined> {
  const project = await ps.getProject({
    slug,
    select: [
      'display',
      'statuses',
      'scalingInfo',
      'scalingRisks',
      'scalingStage',
      'scalingTechnology',
      'tvlInfo',
    ],
    optional: [
      'contracts',
      'permissions',
      'chainConfig',
      'scalingDa',
      'customDa',
      'isUpcoming',
      'archivedAt',
      'milestones',
      'trackedTxsConfig',
      'tvsConfig',
    ],
  })
  if (!project) return undefined

  const [searchBarProjects, projectEntry] = await Promise.all([
    getSearchBarProjects(),
    getScalingProjectEntry(project),
  ])

  return {
    head: {
      manifest,
      title: `${project.name} - L2BEAT`,
      description: project.display.description,
    },
    ssr: {
      page: 'ScalingProjectPage',
      props: {
        projectEntry,
        searchBarProjects,
        terms: getCollection('glossary').map((term) => ({
          id: term.id,
          matches: [term.data.term, ...(term.data.match ?? [])],
        })),
      },
    },
  }
}
