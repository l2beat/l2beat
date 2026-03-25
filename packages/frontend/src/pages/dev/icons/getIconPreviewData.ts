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
        title: 'Icon Preview - L2BEAT',
        description:
          'Development-only gallery of frontend icon components used across L2BEAT.',
        openGraph: {
          url,
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
