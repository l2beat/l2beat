import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getDefiProjectEntry } from '~/server/features/defi/project/getDefiProjectEntry'
import { getDefiProjectTotalValueLocked } from '~/server/features/defi/project/getDefiProjectTotalValueLocked'
import { getProjectSectionLinks } from '~/server/features/projects/getProjectSectionLinks'
import { getProjectVersionLinks } from '~/server/features/projects/getProjectVersionLinks'
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

/**
 * The markdown alternate of the page, built from the same cached entry as the
 * HTML. Liquid staking pages show the TVL in their header, so the entry has
 * it; the other DeFi pages only chart it in the browser, so it is queried
 * apart for them.
 */
export async function getDefiProjectMarkdown(
  slug: string,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<string | undefined> {
  const data = await getCachedDefiProjectPage(slug, manifest, cache)
  if (!data) return undefined

  const { entry } = data.props
  const totalValueLockedUsd = entry.liquidStaking
    ? entry.liquidStaking.totalValueLockedUsd
    : await getCachedTotalValueLocked(slug, cache)
  return renderDefiProjectMarkdown(entry, totalValueLockedUsd)
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

function getCachedTotalValueLocked(slug: string, cache: InMemoryCache) {
  return cache.get(
    {
      key: ['defi', 'projects', slug, 'tvl'],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    () => getDefiProjectTotalValueLocked(slug),
  )
}

async function loadDefiProjectPage(manifest: Manifest, slug: string) {
  const helpers = getSsrHelpers()
  const [appLayoutProps, entry, sectionLinks, versionLinks] = await Promise.all(
    [
      getAppLayoutProps(),
      getDefiProjectEntry(slug, helpers),
      getProjectSectionLinks(slug),
      getProjectVersionLinks(slug, 'defi'),
    ],
  )

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
      sectionLinks,
      versionLinks,
      queryState: helpers.dehydrate(),
    },
  }
}
