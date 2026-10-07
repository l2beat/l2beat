import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getIconPreviewData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: 'Icon Preview',
        description:
          'Development-only gallery of frontend icon components used across L2BEAT.',
        url,
        openGraph: {
          image: '/meta-images/icon-preview/opengraph-image.png',
        },
        excludeFromSearchEngines: true,
      }),
    },
    ssr: {
      page: 'IconPreviewPage',
      props: appLayoutProps,
    },
  }
}
