import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getPrivacyProjectDetails } from '~/server/features/privacy/getPrivacyProjectDetails'
import { getPrivacyProjectEntry } from '~/server/features/privacy/project/getPrivacyProjectEntry'
import { getProjectSections } from '~/server/features/projects/getProjectSections'
import { getProjectVersionLinks } from '~/server/features/projects/getProjectVersionLinks'
import { mergeProjectSections } from '~/server/features/projects/mergeProjectSections'
import { getZkCatalogProjectEntry } from '~/server/features/zk-catalog/project/getZkCatalogProjectEntry'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import { getPrivacyMetadataDescription } from '~/ssr/head/projectMetaDescriptions'
import { getWebPageStructuredData } from '~/ssr/head/structured-data/getWebPageStructuredData'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { getProjectOgImagePath } from '~/utils/project/getProjectUrl'
import { renderPrivacyProjectMarkdown } from './renderPrivacyProjectMarkdown'

export async function getPrivacyProjectData(
  manifest: Manifest,
  slug: string,
  cache: InMemoryCache,
  selectedUpdateId?: string,
): Promise<RenderData | undefined> {
  const data = await getCachedPrivacyProjectPage(manifest, slug, cache)
  if (!data) return undefined

  return {
    head: data.head,
    ssr: {
      page: 'PrivacyProjectPage',
      props: {
        ...data.props,
        selectedUpdateId,
      },
    },
  }
}

/** The markdown alternate of the page, built from the same cached entry as the HTML. */
export async function getPrivacyProjectMarkdown(
  manifest: Manifest,
  slug: string,
  cache: InMemoryCache,
): Promise<string | undefined> {
  const data = await getCachedPrivacyProjectPage(manifest, slug, cache)
  return data && renderPrivacyProjectMarkdown(data.props.entry)
}

function getCachedPrivacyProjectPage(
  manifest: Manifest,
  slug: string,
  cache: InMemoryCache,
) {
  return cache.get(
    {
      key: ['privacy', 'projects', slug],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    () => loadPrivacyProjectPage(manifest, slug),
  )
}

async function loadPrivacyProjectPage(manifest: Manifest, slug: string) {
  const helpers = getSsrHelpers()
  const [appLayoutProps, details, projectSections, versionLinks] =
    await Promise.all([
      getAppLayoutProps(),
      getPrivacyProjectDetails(slug),
      getProjectSections(slug),
      getProjectVersionLinks(slug),
    ])

  if (!details) {
    return undefined
  }

  const [projectEntry, zkCatalog] = await Promise.all([
    getPrivacyProjectEntry(details, helpers),
    getZkCatalogEntry(slug),
  ])
  if (zkCatalog) {
    projectEntry.sections = mergeProjectSections(
      projectEntry.sections,
      zkCatalog.sections,
      {
        insertAfterId: 'upgrades-and-governance',
        // The same value as Value Locked. TODO: decide which to show.
        drop: ['tvs'],
      },
    )
    for (const section of projectEntry.sections) {
      // Links to the ZK Catalog page's Value Secured land on Value Locked.
      if (section.type === 'TvsValueSection') section.props.aliasIds = ['tvs']
    }
  }

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: details.name,
        title: `${details.name} Privacy Review & Risks - ETHBEAT`,
        description: getPrivacyMetadataDescription({
          name: details.name,
          category: details.category.label,
          description: details.display.description,
          promise: details.adversaries.promise.text,
        }),
        // Derived from the slug, not the request URL: the cache entry is
        // shared by every request for the project, including the .md one.
        url: `/projects/${details.slug}`,
        openGraph: {
          image: getProjectOgImagePath(details.slug),
        },
        structuredData: (page) => [
          getWebPageStructuredData(page, {
            name: `${details.name} privacy review`,
            about: details.name,
          }),
        ],
      }),
    },
    props: {
      ...appLayoutProps,
      entry: projectEntry,
      zkCatalog: zkCatalog && {
        creator: zkCatalog.creator,
        header: {
          trustedSetupsByProofSystem:
            zkCatalog.header.trustedSetupsByProofSystem,
          techStack: zkCatalog.header.techStack,
        },
      },
      projectSections,
      versionLinks,
      queryState: helpers.dehydrate(),
    },
  }
}

/** The ZK Catalog page of a privacy protocol that is also in the catalog. */
async function getZkCatalogEntry(slug: string) {
  const project = await ps.getProject({
    slug,
    select: ['zkCatalogInfo', 'display', 'statuses'],
    optional: ['archivedAt', 'milestones', 'tvsInfo'],
  })
  return project && getZkCatalogProjectEntry(project)
}
