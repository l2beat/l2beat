import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export function getEthereumConnectData(
  manifest: Manifest,
  url: string,
): RenderData {
  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Ethereum Connect Survey',
        description:
          'Help us understand the needs of professionals in LATAM who want to learn more about crypto and Ethereum by filling this quick survey',
        openGraph: {
          url,
          image: '/meta-images/governance/ethereum-connect/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'EthereumConnectPage',
      props: undefined,
    },
  }
}
