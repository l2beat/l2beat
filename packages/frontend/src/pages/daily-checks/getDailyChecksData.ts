import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '../../utils/Manifest'

export async function getDailyChecksData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Daily checks - L2BEAT',
        description: 'Quick links to L2BEAT Elastic Search dashboards.',
        url,
        openGraph: {
          image: '/meta-images/brand-kit/opengraph-image.png',
        },
        excludeFromSearchEngines: true,
      }),
    },
    ssr: {
      page: 'DailyChecksPage',
      props: {
        ...appLayoutProps,
      },
    },
  }
}
