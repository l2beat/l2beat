import { type InMemoryCache, UnixTime } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { CollectionEntry } from '~/content/getCollection'
import { getArticleStructuredData } from '~/pages/publications/utils/getArticleStructuredData'
import { getMonthlyUpdateEntry } from '~/server/features/monthly-reports/getMonthlyUpdateEntry'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getMonthlyUpdateData(
  manifest: Manifest,
  monthlyUpdate: CollectionEntry<'monthly-updates'>,
  url: string,
  cache: InMemoryCache,
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
        name: monthlyUpdateEntry.title,
        title: `${monthlyUpdateEntry.title} Update - L2BEAT`,
        description:
          "L2BEAT's monthly overview of the Ethereum scaling ecosystem: key news, protocol updates, and metrics.",
        url,
        openGraph: {
          image: `/meta-images/publications/${monthlyUpdateEntry.id}.png`,
        },
        structuredData: (page) => [
          getArticleStructuredData(page, {
            headline: monthlyUpdate.data.title,
            publishedOn: monthlyUpdate.data.publishedOn,
            description: monthlyUpdate.data.description,
          }),
        ],
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
