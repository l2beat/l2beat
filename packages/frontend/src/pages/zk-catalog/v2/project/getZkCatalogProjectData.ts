import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getZkCatalogProjectEntry } from '~/server/features/zk-catalog/project/getZkCatalogProjectEntry'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { renderZkCatalogProjectMarkdown } from './renderZkCatalogProjectMarkdown'

export async function getZkCatalogProjectData(
  slug: string,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData | undefined> {
  const data = await getCachedZkCatalogProjectPage(slug, manifest, cache)
  if (!data) return undefined

  return {
    head: data.head,
    ssr: {
      page: 'ZkCatalogProjectPage',
      props: data.props,
    },
  }
}

/** The markdown alternate of the page, built from the same cached entry as the HTML. */
export async function getZkCatalogProjectMarkdown(
  slug: string,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<string | undefined> {
  const data = await getCachedZkCatalogProjectPage(slug, manifest, cache)
  return data && renderZkCatalogProjectMarkdown(data.props.projectEntry)
}

function getCachedZkCatalogProjectPage(
  slug: string,
  manifest: Manifest,
  cache: InMemoryCache,
) {
  return cache.get(
    {
      key: ['zk-catalog', 'v2', 'projects', slug],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    () => loadZkCatalogProjectPage(manifest, slug),
  )
}

async function loadZkCatalogProjectPage(manifest: Manifest, slug: string) {
  const helpers = getSsrHelpers()
  const project = await ps.getProject({
    slug,
    select: ['zkCatalogInfo', 'display', 'statuses'],
    optional: ['archivedAt', 'milestones', 'tvsInfo'],
  })
  if (!project) return undefined

  const [appLayoutProps, projectEntry] = await Promise.all([
    getAppLayoutProps(),
    getZkCatalogProjectEntry(project),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${project.name} - L2BEAT`,
        description: project.display.description,
        // Derived from the slug, not the request URL: the cache entry is
        // shared by every request for the project, including the .md one.
        url: `/zk-catalog/${project.slug}`,
        openGraph: {
          image: `/meta-images/zk-catalog/projects/${project.slug}/opengraph-image.png`,
        },
        markdownAlternatePath: `/zk-catalog/${project.slug}.md`,
      }),
    },
    props: {
      ...appLayoutProps,
      projectEntry,
      queryState: helpers.dehydrate(),
    },
  }
}
