import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getBridgesProjectEntry } from '~/server/features/bridges/project/get-bridges-project-entry'
import { ps } from '~/server/projects'
import type { Manifest } from '~/utils/Manifest'

export async function getBridgesProjectData(
  manifest: Manifest,
  slug: string,
): Promise<RenderData | undefined> {
  const project = await ps.getProject({
    slug,
    select: [
      'display',
      'statuses',
      'tvsInfo',
      'tvsConfig',
      'bridgeInfo',
      'bridgeRisks',
      'bridgeTechnology',
      'display',
    ],
    where: ['isBridge'],
    optional: [
      'chainConfig',
      'archivedAt',
      'isUpcoming',
      'milestones',
      'contracts',
      'permissions',
    ],
  })

  if (!project) return undefined

  const [appLayoutProps, projectEntry] = await Promise.all([
    getAppLayoutProps(),
    getBridgesProjectEntry(project),
  ])

  return {
    head: {
      manifest,
      title: `${project.name} - L2BEAT`,
      description: project.display.description,
    },
    ssr: {
      page: 'BridgesProjectPage',
      props: {
        ...appLayoutProps,
        projectEntry,
      },
    },
  }
}
