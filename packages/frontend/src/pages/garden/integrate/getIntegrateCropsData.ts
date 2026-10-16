import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getAttestationsMeta } from '~/server/features/garden/getAttestationsMeta'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { CROPS_API_ENDPOINTS } from './content'
import { getIntegrateExamples } from './getIntegrateExamples'

export async function getIntegrateCropsData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const [appLayoutProps, examples, attestations] = await Promise.all([
    getAppLayoutProps(),
    getIntegrateExamples(),
    getAttestationsMeta(),
  ])
  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: 'Integrate CROPS',
        description:
          'Pull the CROPS evaluations from The Infinite Garden into your own app.',
        url,
        openGraph: {
          image: '/meta-images/the-infinite-garden/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'IntegrateCropsPage',
      props: {
        ...appLayoutProps,
        attestations,
        endpoints: CROPS_API_ENDPOINTS,
        examples,
      },
    },
  }
}
