import { UnixTime } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getCollection } from '~/content/getCollection'
import { env } from '~/env'
import type { ICache } from '~/server/cache/ICache'
import { getMonthlyUpdateEntry } from '~/server/features/monthly-reports/getMonthlyUpdateEntry'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getMonthlyUpdateData(
  manifest: Manifest,
  id: string,
  url: string,
  cache: ICache,
): Promise<RenderData | undefined> {
  const publications = getCollection('monthly-updates')

  const monthlyUpdate = publications.find((p) => p.id === id)
  if (!monthlyUpdate || !env.CLIENT_SIDE_PARTNERS) {
    return undefined
  }

  const [appLayoutProps, monthlyUpdateEntry] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['monthly-updates', 'data'],
        ttl: UnixTime.HOUR,
        staleWhileRevalidate: UnixTime.HOUR,
      },
      () => getMonthlyUpdateEntry(monthlyUpdate),
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${monthlyUpdateEntry.title} Update - L2BEAT`,
        description:
          "L2BEAT's monthly overview of the Ethereum scaling ecosystem: key news, protocol updates, and metrics.",
        openGraph: {
          url,
          image: '/meta-images/monthly-updates/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'MonthlyUpdatePage',
      props: {
        ...appLayoutProps,
        entry: monthlyUpdateEntry,
      },
    },
  }
}
