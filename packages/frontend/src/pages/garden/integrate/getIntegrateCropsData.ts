import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getAttestationsMeta } from '~/server/features/garden/getCropsProjects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getIntegrateCropsData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Integrate CROPS - L2BEAT',
        description:
          'Pull the CROPS evaluations from The Infinite Garden into your own app.',
        url,
        // Shares the garden image on purpose: a missing one throws in
        // production rather than falling back.
        openGraph: {
          image: '/meta-images/the-infinite-garden/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'IntegrateCropsPage',
      props: {
        ...(await getAppLayoutProps()),
        // Read from config rather than retyped here, so the page cannot drift
        // from what the CLI actually signs.
        attestations: getAttestationsMeta(),
      },
    },
  }
}
