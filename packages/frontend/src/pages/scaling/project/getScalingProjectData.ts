import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getScalingProjectEntry } from '~/server/features/scaling/project/getScalingProjectEntry'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getExpressHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingProjectData(
  manifest: Manifest,
  slug: string,
  url: string,
): Promise<RenderData | undefined> {
  const helpers = getExpressHelpers()
  const project = await ps.getProject({
    slug,
    select: [
      'display',
      'statuses',
      'scalingInfo',
      'scalingRisks',
      'scalingStage',
      'scalingTechnology',
      'tvsInfo',
    ],
    optional: [
      'contracts',
      'permissions',
      'chainConfig',
      'scalingDa',
      'livenessConfig',
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
    getScalingProjectEntry(project, helpers),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${project.name} - L2BEAT`,
        description: project.display.description,
        openGraph: {
          url,
          image: `/meta-images/scaling/projects/${project.slug}/opengraph-image.png`,
        },
      }),
    },
    ssr: {
      page: 'ScalingProjectPage',
      props: {
        ...appLayoutProps,
        projectEntry: projectEntry,
        queryState: helpers.dehydrate(),
      },
    },
  }
}
