import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
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
        name: 'Donate',
        description:
          "Support L2BEAT's independent research & development with a donation.",
        url,
        openGraph: {
          image: '/meta-images/donate/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'DonatePage',
      props: {
        ...appLayoutProps,
        gitcoinOption: false,
        qrCodeUrl: manifest.getUrl('/images/qr-codes/donate.png'),
      },
    },
  }
}
