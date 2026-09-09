import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getPrivacyProjectDetails } from '~/server/features/privacy/getPrivacyProjectDetails'
import { getPrivacyProjectEntry } from '~/server/features/privacy/project/getPrivacyProjectEntry'
import { getMetadata } from '~/ssr/head/getMetadata'
import { getProjectMetadataDescription } from '~/ssr/head/getProjectMetadataDescription'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

export async function getPrivacyProjectData(
  manifest: Manifest,
  slug: string,
  url: string,
  cache: InMemoryCache,
  selectedUpdateId?: string,
): Promise<RenderData | undefined> {
  const data = await cache.get(
    {
      key: ['privacy', 'projects', slug],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    () => getCachedData(manifest, slug, url),
  )
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

async function getCachedData(manifest: Manifest, slug: string, url: string) {
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
        description: getProjectMetadataDescription(details),
        url,
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
