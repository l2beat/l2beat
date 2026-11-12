import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getProjectSections } from '~/server/features/projects/getProjectSections'
import { getProjectVersionLinks } from '~/server/features/projects/getProjectVersionLinks'
import { getZkCatalogProjectEntry } from '~/server/features/zk-catalog/project/getZkCatalogProjectEntry'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import { getZkCatalogMetadataDescription } from '~/ssr/head/projectMetaDescriptions'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import {
  getProjectOgImagePath,
  getProjectPath,
} from '~/utils/project/getProjectPath'
import { renderZkCatalogProjectMarkdown } from './renderZkCatalogProjectMarkdown'

export async function getZkCatalogProjectData(
  manifest: Manifest,
  slug: string,
  cache: InMemoryCache,
): Promise<RenderData | undefined> {
  const data = await getCachedZkCatalogProjectPage(manifest, slug, cache)
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
  manifest: Manifest,
  slug: string,
  cache: InMemoryCache,
): Promise<string | undefined> {
  const data = await getCachedZkCatalogProjectPage(manifest, slug, cache)
  return data && renderZkCatalogProjectMarkdown(data.props.projectEntry)
}

function getCachedZkCatalogProjectPage(
  manifest: Manifest,
  slug: string,
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

  const [appLayoutProps, projectEntry, projectSections, versionLinks] =
    await Promise.all([
      getAppLayoutProps(),
      getZkCatalogProjectEntry(project),
      getProjectSections(slug),
      getProjectVersionLinks(slug),
    ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: project.name,
        description: getZkCatalogMetadataDescription({
          name: project.name,
          creator: project.zkCatalogInfo.creator,
          tvs: projectEntry.header.tvs.value,
          description: project.display.description,
        }),
        // Derived from the slug, not the request URL: the cache entry is
        // shared by every request for the project, including the .md one.
        url: getProjectPath(project.slug),
        openGraph: {
          image: getProjectOgImagePath(project.slug),
        },
      }),
    },
    props: {
      ...appLayoutProps,
      projectEntry,
      projectSections,
      versionLinks,
      queryState: helpers.dehydrate(),
    },
  }
}
