import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getDefiProjectEntry } from '~/server/features/defi/project/getDefiProjectEntry'
import { getMetadata } from '~/ssr/head/getMetadata'
import { getProjectMetadataDescription } from '~/ssr/head/getProjectMetadataDescription'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

export async function getDefiProjectData(
  manifest: Manifest,
  slug: string,
  url: string,
): Promise<RenderData | undefined> {
  const helpers = getSsrHelpers()
  const [appLayoutProps, entry] = await Promise.all([
    getAppLayoutProps(),
    getDefiProjectEntry(slug, helpers),
  ])

  if (!entry) {
    return undefined
  }

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${entry.name} - DeFi - L2BEAT`,
        description: getProjectMetadataDescription({
          name: entry.name,
          display: {
            description: entry.description,
          },
        }),
        url,
        openGraph: {
          image: `/meta-images/defi/projects/${entry.slug}/opengraph-image.png`,
        },
      }),
    },
    ssr: {
      page: 'DefiProjectPage',
      props: {
        ...appLayoutProps,
        entry,
        queryState: helpers.dehydrate(),
      },
    },
  }
}
