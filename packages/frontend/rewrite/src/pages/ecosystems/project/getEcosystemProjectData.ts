import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getEcosystemEntry } from '~/server/features/ecosystems/get-ecosystem-entry'
import type { Manifest } from '~/utils/Manifest'

export async function getEcosystemProjectData(
  manifest: Manifest,
  slug: string,
  url: string,
): Promise<RenderData | undefined> {
  const [appLayoutProps, ecosystem] = await Promise.all([
    getAppLayoutProps(),
    getEcosystemEntry(slug),
  ])

  if (!ecosystem) {
    return undefined
  }

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${ecosystem.name} - L2BEAT`,
        openGraph: {
          url,
        },
      }),
    },
    ssr: {
      page: 'EcosystemProjectPage',
      props: {
        ...appLayoutProps,
        ecosystem,
      },
    },
  }
}
