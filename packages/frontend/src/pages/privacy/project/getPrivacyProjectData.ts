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
): Promise<RenderData | undefined> {
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
    ssr: {
      page: 'PrivacyProjectPage',
      props: {
        ...appLayoutProps,
        entry: projectEntry,
        queryState: helpers.dehydrate(),
      },
    },
  }
}
