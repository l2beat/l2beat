import { UnixTime } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { CollectionEntry } from '~/content/getCollection'
import type { ICache } from '~/server/cache/ICache'
import { getMonthlyUpdateEntry } from '~/server/features/monthly-reports/getMonthlyUpdateEntry'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getMonthlyUpdateData(
  manifest: Manifest,
  monthlyUpdate: CollectionEntry<'monthly-updates'>,
  url: string,
  cache: ICache,
): Promise<RenderData> {
  const [appLayoutProps, monthlyUpdateEntry] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['monthly-updates', 'data', monthlyUpdate.id],
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
          image: `/meta-images/publications/${monthlyUpdateEntry.id}.png`,
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
