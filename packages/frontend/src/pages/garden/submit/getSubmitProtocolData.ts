import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getSubmitProtocolData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: 'Submit your protocol',
        description:
          'How a protocol joins The Infinite Garden: what we look for in censorship resistance, open source, privacy and security, and what happens after you submit the form.',
        url,
        openGraph: {
          image: '/meta-images/submit-your-protocol/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'SubmitProtocolPage',
      props: await getAppLayoutProps(),
    },
  }
}
