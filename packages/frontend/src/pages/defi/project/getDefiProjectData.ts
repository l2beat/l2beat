import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getDefiProjectEntry } from '~/server/features/defi/project/getDefiProjectEntry'
import { getMetadata } from '~/ssr/head/getMetadata'
import { getProjectMetadataDescription } from '~/ssr/head/projectMetaDescriptions'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { renderDefiProjectMarkdown } from './renderDefiProjectMarkdown'

export async function getDefiProjectData(
  slug: string,
  manifest: Manifest,
  cache: InMemoryCache,
  selectedUpdateId?: string,
): Promise<RenderData | undefined> {
  const data = await getCachedDefiProjectPage(slug, manifest, cache)
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

/** The markdown alternate of the page, built from the same cached entry as the HTML. */
export async function getDefiProjectMarkdown(
  slug: string,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<string | undefined> {
  const data = await getCachedDefiProjectPage(slug, manifest, cache)
  return data && renderDefiProjectMarkdown(data.props.entry)
}

function getCachedDefiProjectPage(
  slug: string,
  manifest: Manifest,
  cache: InMemoryCache,
) {
  return cache.get(
    {
      key: ['defi', 'projects', slug],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    () => loadDefiProjectPage(manifest, slug),
  )
}

async function loadDefiProjectPage(manifest: Manifest, slug: string) {
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
        name: entry.name,
        title: `${entry.name} - DeFi - L2BEAT`,
        description: getProjectMetadataDescription(entry),
        // Derived from the slug, not the request URL: the cache entry is
        // shared by every request for the project, including the .md one.
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
