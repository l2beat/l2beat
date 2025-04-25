import type { Manifest } from 'rewrite/src/common/Manifest'
import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { RenderData } from 'rewrite/src/ssr/server'
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

  const [appLayoutProps, projectEntry] = await Promise.all([
    getAppLayoutProps(),
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
        ...appLayoutProps,
        projectEntry,
      },
    },
  }
}
