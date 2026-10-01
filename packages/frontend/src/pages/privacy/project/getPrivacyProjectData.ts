import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getPrivacyProjectDetails } from '~/server/features/privacy/getPrivacyProjectDetails'
import { getPrivacyProjectEntry } from '~/server/features/privacy/project/getPrivacyProjectEntry'
import { getMetadata } from '~/ssr/head/getMetadata'
import { getPrivacyMetadataDescription } from '~/ssr/head/projectMetaDescriptions'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
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
  const [appLayoutProps, details] = await Promise.all([
    getAppLayoutProps(),
    getPrivacyProjectDetails(slug),
  ])

  if (!details) {
    return undefined
  }

  const projectEntry = await getPrivacyProjectEntry(details, helpers)

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${details.name} - Privacy Dashboard - L2BEAT`,
        description: getPrivacyMetadataDescription({
          name: details.name,
          category: details.category.label,
          description: details.display.description,
        }),
        // Derived from the slug, not the request URL: the cache entry is
        // shared by every request for the project, including the .md one.
        url: `/privacy/projects/${details.slug}`,
        openGraph: {
          image: `/meta-images/privacy/projects/${details.slug}/opengraph-image.png`,
        },
      }),
    },
    props: {
      ...appLayoutProps,
      entry: projectEntry,
      queryState: helpers.dehydrate(),
    },
  }
}
