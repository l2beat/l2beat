import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getPrivacyProjects } from '~/server/features/privacy/getPrivacyProjects'
import { getPrivacySummaryEntries } from '~/server/features/privacy/getPrivacySummaryEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getPrivacySummaryGroups } from '../summary/privacySummaryGroups'

export async function getPrivacyArchivedData(
  manifest: Manifest,
  url: string,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, groups] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['privacy', 'archived', 'groups'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      async () =>
        getPrivacySummaryGroups(
          await getPrivacySummaryEntries(await getPrivacyProjects('archived')),
        ),
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: 'Archived privacy protocols',
        description:
          'Privacy protocols that shut down, were drained or were replaced by a newer version, with their last known data.',
        url,
        openGraph: {
          image: '/meta-images/privacy/archived/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'PrivacyArchivedPage',
      props: {
        ...appLayoutProps,
        groups,
      },
    },
  }
}
