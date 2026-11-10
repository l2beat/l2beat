import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getPrivacyProjectDetails } from '~/server/features/privacy/getPrivacyProjectDetails'
import { getPrivacyProject } from '~/server/features/privacy/getPrivacyProjects'
import { getPrivacyProjectEntry } from '~/server/features/privacy/project/getPrivacyProjectEntry'
import { getPrivacyProjectPages } from '~/server/features/privacy/utils/getPrivacyProjectPages'
import { getProjectSectionLinks } from '~/server/features/projects/getProjectSectionLinks'
import { getProjectVersionLinks } from '~/server/features/projects/getProjectVersionLinks'
import { getMetadata } from '~/ssr/head/getMetadata'
import { getPrivacyMetadataDescription } from '~/ssr/head/projectMetaDescriptions'
import { getWebPageStructuredData } from '~/ssr/head/structured-data/getWebPageStructuredData'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { renderPrivacyProjectMarkdown } from './renderPrivacyProjectMarkdown'

/**
 * @param chain The tracked chain of the URL, for a project with a page per
 *   chain. Its first chain is the project's own page, so that URL redirects.
 */
export async function getPrivacyProjectData(
  manifest: Manifest,
  slug: string,
  chain: string | undefined,
  cache: InMemoryCache,
  selectedUpdateId?: string,
): Promise<RenderData | { redirect: string } | undefined> {
  const page = await getPrivacyProjectPage(manifest, slug, chain, cache)
  if (!page || 'redirect' in page) return page

  return {
    head: page.head,
    ssr: {
      page: 'PrivacyProjectPage',
      props: {
        ...page.props,
        selectedUpdateId,
      },
    },
  }
}

/** The markdown alternate of the page, built from the same cached entry as the HTML. */
export async function getPrivacyProjectMarkdown(
  manifest: Manifest,
  slug: string,
  chain: string | undefined,
  cache: InMemoryCache,
): Promise<string | undefined> {
  const page = await getPrivacyProjectPage(manifest, slug, chain, cache)
  if (!page || 'redirect' in page) return undefined
  return renderPrivacyProjectMarkdown(page.props.entry)
}

async function getPrivacyProjectPage(
  manifest: Manifest,
  slug: string,
  chain: string | undefined,
  cache: InMemoryCache,
) {
  if (chain !== undefined) {
    // Only the project's own chains have a page, so only those get cached.
    const project = await getPrivacyProject(slug)
    const pages = project ? getPrivacyProjectPages(project) : []
    const page = pages.find((p) => p.chain === chain)
    if (!page) return undefined
    if (page === pages[0]) return { redirect: page.path }
  }
  return getCachedPrivacyProjectPage(manifest, slug, chain, cache)
}

function getCachedPrivacyProjectPage(
  manifest: Manifest,
  slug: string,
  chain: string | undefined,
  cache: InMemoryCache,
) {
  return cache.get(
    {
      key: ['privacy', 'projects', slug, ...(chain ? [chain] : [])],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    () => loadPrivacyProjectPage(manifest, slug, chain),
  )
}

async function loadPrivacyProjectPage(
  manifest: Manifest,
  slug: string,
  chain: string | undefined,
) {
  const helpers = getSsrHelpers()
  const [appLayoutProps, details, sectionLinks, versionLinks] =
    await Promise.all([
      getAppLayoutProps(),
      getPrivacyProjectDetails(slug, chain),
      getProjectSectionLinks(slug),
      getProjectVersionLinks(slug, 'privacy'),
    ])

  if (!details) {
    return undefined
  }

  const projectEntry = await getPrivacyProjectEntry(details, helpers)
  // A chain's page is named after it, the project's own page is not.
  const name =
    chain && projectEntry.chainView
      ? `${details.name} on ${projectEntry.chainView.selected.name}`
      : details.name

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name,
        title: `${name} Privacy Review & Risks - ETHBEAT`,
        description: getPrivacyMetadataDescription({
          name: details.name,
          category: details.category.label,
          description: details.display.description,
          promise: details.adversaries.promise.text,
        }),
        // Derived from the entry, not the request URL: the cache entry is
        // shared by every request for the page, including the .md one.
        url: projectEntry.href,
        openGraph: {
          image: `/meta-images/privacy/projects/${details.slug}/opengraph-image.png`,
        },
        structuredData: (page) => [
          getWebPageStructuredData(page, {
            name: `${name} privacy review`,
            about: details.name,
          }),
        ],
      }),
    },
    props: {
      ...appLayoutProps,
      entry: projectEntry,
      sectionLinks,
      versionLinks,
      queryState: helpers.dehydrate(),
    },
  }
}
