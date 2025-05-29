import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ICache } from '~/server/cache/ICache'
import { getScalingFinalityEntries } from '~/server/features/scaling/finality/get-scaling-finality-entries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingFinalityData(
  req: Request,
  manifest: Manifest,
  cache: ICache,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps({
      recategorisationPreview: req.query.recategorisationPreview === 'true',
    }),
    cache.get(
      {
        key: ['scaling', 'finality', 'entries'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      getScalingFinalityEntries,
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        openGraph: {
          url: req.originalUrl,
          image: '/meta-images/scaling/finality/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'ScalingFinalityPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
