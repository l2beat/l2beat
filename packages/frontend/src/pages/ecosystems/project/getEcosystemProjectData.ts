import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getEcosystemEntry } from '~/server/features/ecosystems/getEcosystemEntry'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

export async function getEcosystemProjectData(
  manifest: Manifest,
  slug: string,
  url: string,
): Promise<RenderData | undefined> {
  const helpers = getSsrHelpers()
  const [appLayoutProps, ecosystem] = await Promise.all([
    getAppLayoutProps(),
    getEcosystemEntry(slug, helpers),
  ])

  if (!ecosystem) {
    return undefined
  }

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${ecosystem.name} - L2BEAT`,
        description: `Get an overview of the scaling projects in the ${ecosystem.name} ecosystem.`,
        openGraph: {
          url,
          image: `/meta-images/ecosystems/${ecosystem.id}/opengraph-image.png`,
        },
      }),
    },
    ssr: {
      page: 'EcosystemProjectPage',
      props: {
        ...appLayoutProps,
        ecosystem,
        queryState: helpers.dehydrate(),
      },
    },
  }
}
