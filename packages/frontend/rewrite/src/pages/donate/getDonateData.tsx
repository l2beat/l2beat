import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import type { RenderData } from 'rewrite/src/ssr/server'
import type { Manifest } from '~/utils/Manifest'

export async function getDonateData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Donate - L2BEAT',
        openGraph: {
          url,
          image: '/meta-images/donate/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'DonatePage',
      props: {
        ...appLayoutProps,
        qrCodeUrl: manifest.getUrl('/images/qr-codes/donate.png'),
      },
    },
  }
}
