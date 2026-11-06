import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getHeartbeatProjects } from '~/server/features/heartbeat/getHeartbeatProjects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getHeartbeatPageData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const [appLayoutProps, projects] = await Promise.all([
    getAppLayoutProps(),
    getHeartbeatProjects(manifest),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: 'Heartbeat',
        description:
          'Transactions, user operations and gas per second on every chain, block by block.',
        url,
        openGraph: {
          image: '/meta-images/heartbeat/opengraph-image.png',
        },
        breadcrumbParents: [{ name: 'Activity', path: '/layer2s/activity' }],
      }),
    },
    ssr: {
      page: 'HeartbeatPage',
      props: { ...appLayoutProps, projects },
    },
  }
}
