import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getPrivacyProjectDetails } from '~/server/features/privacy/getPrivacyProjectDetails'
import { getPrivacyProjectEntry } from '~/server/features/privacy/project/getPrivacyProjectEntry'
import {
  getPrivacyProjectChainHref,
  resolvePrivacyChain,
} from '~/server/features/privacy/utils/resolvePrivacyChain'
import { getProjectSectionLinks } from '~/server/features/projects/getProjectSectionLinks'
import { getProjectVersionLinks } from '~/server/features/projects/getProjectVersionLinks'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import { getPrivacyMetadataDescription } from '~/ssr/head/projectMetaDescriptions'
import { getWebPageStructuredData } from '~/ssr/head/structured-data/getWebPageStructuredData'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { renderPrivacyProjectMarkdown } from './renderPrivacyProjectMarkdown'

export async function getPrivacyProjectData(
  manifest: Manifest,
  slug: string,
  cache: InMemoryCache,
  selectedUpdateId?: string,
  chain?: string,
): Promise<RenderData | undefined> {
  const data = await getCachedPrivacyProjectPage(manifest, slug, cache, chain)
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
  chain?: string,
): Promise<string | undefined> {
  const data = await getCachedPrivacyProjectPage(manifest, slug, cache, chain)
  return data && renderPrivacyProjectMarkdown(data.props.entry)
}

/**
 * One cache entry per project and tracked chain. An unknown or untracked
 * chain shares the primary chain's entry, so it can't grow the cache.
 */
async function getCachedPrivacyProjectPage(
  manifest: Manifest,
  slug: string,
  cache: InMemoryCache,
  requestedChain: string | undefined,
) {
  const trackedOn = await getTrackedOn(slug)
  if (!trackedOn) return undefined
  const chain = resolvePrivacyChain(trackedOn, requestedChain)

  return cache.get(
    {
      key: ['privacy', 'projects', slug, chain],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    () => loadPrivacyProjectPage(manifest, slug, chain),
  )
}

async function getTrackedOn(slug: string): Promise<string[] | undefined> {
  const project = await ps.getProject({
    slug,
    where: ['privacyInfo'],
    select: ['privacyInfo'],
  })
  return project?.privacyInfo.trackedOn
}

async function loadPrivacyProjectPage(
  manifest: Manifest,
  slug: string,
  chain: string,
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
  // Only a multi-chain project names its chain in the title.
  const titleName = details.isMultiChain
    ? `${details.name} on ${details.chainName}`
    : details.name

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: details.name,
        title: `${titleName} Privacy Review & Risks - L2BEAT`,
        description: getPrivacyMetadataDescription({
          name: details.name,
          category: details.category.label,
          description: details.display.description,
          promise: details.adversaries.promise.text,
        }),
        // Derived from the slug and chain, not the request URL: the cache
        // entry is shared by every request for the project page, including
        // the .md one and those naming an untracked chain.
        url: getPrivacyProjectChainHref(
          details.slug,
          details.chains.map((c) => c.id),
          details.chain,
        ),
        openGraph: {
          image: `/meta-images/privacy/projects/${details.slug}/opengraph-image.png`,
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
      sectionLinks,
      versionLinks,
      queryState: helpers.dehydrate(),
    },
  }
}
