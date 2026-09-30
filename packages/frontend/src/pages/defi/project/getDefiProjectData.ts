import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getDefiProjectEntry } from '~/server/features/defi/project/getDefiProjectEntry'
import { getMetadata } from '~/ssr/head/getMetadata'
import { getProjectMetadataDescription } from '~/ssr/head/getProjectMetadataDescription'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

export async function getDefiProjectData(
  manifest: Manifest,
  slug: string,
  cache: InMemoryCache,
  selectedUpdateId?: string,
): Promise<RenderData | undefined> {
  const data = await cache.get(
    {
      key: ['defi', 'projects', slug],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    () => getCachedData(manifest, slug),
  )
  if (!data) return undefined

  return {
    head: data.head,
    ssr: {
      page: 'DefiProjectPage',
      props: {
        ...data.props,
        selectedUpdateId,
      },
    },
  }
}

async function getCachedData(manifest: Manifest, slug: string) {
  const helpers = getSsrHelpers()
  const [appLayoutProps, entry] = await Promise.all([
    getAppLayoutProps(),
    getDefiProjectEntry(slug, helpers),
  ])

  if (!entry) {
    return undefined
  }

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${entry.name} - DeFi - L2BEAT`,
        description: getProjectMetadataDescription({
          name: entry.name,
          display: {
            description: entry.description,
          },
        }),
        // Derived from the slug, not the request URL: the cache entry is
        // shared by every request for the project, whatever its query.
        url: `/defi/projects/${entry.slug}`,
        openGraph: {
          image: `/meta-images/defi/projects/${entry.slug}/opengraph-image.png`,
        },
      }),
    },
    props: {
      ...appLayoutProps,
      entry,
      queryState: helpers.dehydrate(),
    },
  }
}
