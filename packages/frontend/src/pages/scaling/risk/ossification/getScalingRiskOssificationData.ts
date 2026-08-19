import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getOssificationEntries } from '~/server/features/projects/ossification/getOssificationEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingRiskOssificationData(
  req: Request,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['scaling', 'risk', 'ossification', 'entries'],
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
          'Compare how battle-tested the code securing each project is: time since the last critical change and the implicit bug bounty the unchanged code has withstood.',
        url: req.originalUrl,
        openGraph: {
          image: '/meta-images/scaling/risks/overview/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'ScalingRiskOssificationPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
