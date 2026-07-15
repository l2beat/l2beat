import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getNativeRollupsData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const props = {
    ...(await getAppLayoutProps()),
    contributorImages: {
      lucaDonno: manifest.getImage('/images/native-rollups/luca-donno.jpg'),
      justinDrake: manifest.getImage('/images/native-rollups/justin-drake.jpg'),
    },
  }

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Native Rollups - L2BEAT',
        description:
          'Native rollups use proof-carrying transactions so Ethereum can verify L2 blocks with its own execution program and proof infrastructure.',
        url,
        openGraph: {
          image: '/meta-images/native-rollups/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'NativeRollupsPage',
      props,
    },
  }
}
