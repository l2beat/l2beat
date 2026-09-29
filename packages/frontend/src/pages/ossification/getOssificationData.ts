import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getOssificationEntries } from '~/server/features/projects/ossification/getOssificationEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getOssificationData(
  manifest: Manifest,
  url: string,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['ossification', 'entries'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      getOssificationEntries,
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Ossification - L2BEAT',
        description:
          'How long the critical contracts of each project have gone unchanged, and how much value they secured meanwhile.',
        url,
        openGraph: {
          // Placeholder until the page gets its own generated image.
          image: '/meta-images/home/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'OssificationPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
