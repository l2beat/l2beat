import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getMandateData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: 'Mandate',
        description: 'What ETHBEAT does and why.',
        url,
        openGraph: {
          image: '/meta-images/about-us/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'MandatePage',
      props: appLayoutProps,
    },
  }
}
