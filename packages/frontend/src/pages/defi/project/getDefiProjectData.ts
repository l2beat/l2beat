import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getDefiProjectEntry } from '~/server/features/defi/project/getDefiProjectEntry'
import { getDefiProjectTotalValueLocked } from '~/server/features/defi/project/getDefiProjectTotalValueLocked'
import {
  getProjectBreadcrumbs,
  type ProjectPage,
} from '~/server/features/projects/getProjectPage'
import { getProjectVersionLinks } from '~/server/features/projects/getProjectVersionLinks'
import { getMetadata } from '~/ssr/head/getMetadata'
import { getProjectMetadataDescription } from '~/ssr/head/projectMetaDescriptions'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import {
  getProjectOgImagePath,
  getProjectPath,
} from '~/utils/project/getProjectPath'
import { renderDefiProjectMarkdown } from './renderDefiProjectMarkdown'

export async function getDefiProjectData(
  page: ProjectPage,
  manifest: Manifest,
  cache: InMemoryCache,
  selectedUpdateId?: string,
): Promise<RenderData | undefined> {
  const data = await getCachedDefiProjectPage(page, manifest, cache)
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
 * HTML. The TVL is queried apart: the HTML page only charts it in the
 * browser, so its render should not pay for the query.
 */
export async function getDefiProjectMarkdown(
  page: ProjectPage,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<string | undefined> {
  const [data, totalValueLockedUsd] = await Promise.all([
    getCachedDefiProjectPage(page, manifest, cache),
    getCachedTotalValueLocked(page.slug, cache),
  ])
  return (
    data && renderDefiProjectMarkdown(data.props.entry, totalValueLockedUsd)
  )
}

function getCachedDefiProjectPage(
  page: ProjectPage,
  manifest: Manifest,
  cache: InMemoryCache,
) {
  return cache.get(
    {
      key: ['defi', 'projects', page.slug],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    () => loadDefiProjectPage(manifest, page),
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

async function loadDefiProjectPage(manifest: Manifest, page: ProjectPage) {
  const helpers = getSsrHelpers()
  const [appLayoutProps, entry, versionLinks] = await Promise.all([
    getAppLayoutProps(),
    getDefiProjectEntry(page.slug, helpers),
    getProjectVersionLinks(page.slug),
  ])

  if (!entry) {
    return undefined
  }

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: entry.name,
        title: `${entry.name} - DeFi - ETHBEAT`,
        description: getProjectMetadataDescription(entry),
        // Derived from the slug, not the request URL: the cache entry is
        // shared by every request for the project, including the .md one.
        url: getProjectPath(entry.slug),
        openGraph: {
          image: getProjectOgImagePath(entry.slug),
        },
      }),
    },
    props: {
      ...appLayoutProps,
      entry,
      projectSections: getProjectBreadcrumbs(page),
      versionLinks,
      queryState: helpers.dehydrate(),
    },
  }
}
