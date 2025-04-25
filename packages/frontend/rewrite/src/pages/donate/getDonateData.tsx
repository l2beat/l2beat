import type { Manifest } from 'rewrite/src/common/Manifest'
import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { RenderData } from 'rewrite/src/ssr/server'

export async function getDonateData(manifest: Manifest): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()

  return {
    head: {
      manifest,
      title: 'About us - L2BEAT',
      description:
        'About us - L2BEAT - an analytics and research website about Ethereum layer 2 scaling.',
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
