import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getDefiSummaryEntries } from '~/server/features/defi/getDefiSummaryEntries'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getDefiSummaryData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const [appLayoutProps, projects] = await Promise.all([
    getAppLayoutProps(),
    ps.getProjects({
      where: ['defiInfo'],
      select: ['display', 'defiInfo', 'statuses'],
      optional: [
        'contracts',
        'permissions',
        'discoveryInfo',
        'externalDependencies',
        'tvsConfig',
      ],
    }),
  ])

  const entries = await getDefiSummaryEntries(projects)

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'DeFi - L2BEAT',
        description: 'Overview of DeFi protocols tracked by L2BEAT.',
        url,
        openGraph: {
          image: '/meta-images/project-background.png',
        },
      }),
    },
    ssr: {
      page: 'DefiSummaryPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
