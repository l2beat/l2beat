import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getPrivacyMethodologyMarkdown } from './getPrivacyMethodologyMarkdown'

export async function getPrivacyMethodologyData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: 'Privacy methodology',
        description:
          'How L2BEAT assesses privacy protocols on Ethereum: the privacy promise, the adversaries it is tested against, the verdicts and the other columns.',
        url,
        openGraph: {
          image: '/meta-images/privacy/summary/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'PrivacyMethodologyPage',
      props: {
        ...appLayoutProps,
        content: getPrivacyMethodologyMarkdown(),
      },
    },
  }
}
