import type { Request } from 'express'
import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { ICache } from 'rewrite/src/server/cache/ICache'
import { getScalingArchivedEntries } from 'rewrite/src/server/features/scaling/archived/get-scaling-archived-entries'
import { parseCookies } from 'rewrite/src/server/utils/parseCookies'
import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import type { RenderData } from 'rewrite/src/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingArchivedData(
  req: Request,
  manifest: Manifest,
  cache: ICache,
): Promise<RenderData> {
  const cookies = parseCookies(req)
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps({
      recategorisationPreview: cookies.recategorisationPreview,
    }),
    cache.get(
      {
        key: ['scaling', 'archived', 'entries'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      getScalingArchivedEntries,
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        openGraph: {
          url: req.originalUrl,
          image: '/meta-images/scaling/archived/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'ScalingArchivedPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
