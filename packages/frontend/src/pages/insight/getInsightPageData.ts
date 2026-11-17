import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getInsightPageData(
  manifest: Manifest,
  url: string,
  holder: string | undefined,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: 'Insight',
        description:
          'Which tokens an Ethereum address holds, who issues them and which bridges back them.',
        url,
        openGraph: { image: '/meta-images/tokens/opengraph-image.png' },
      }),
    },
    ssr: {
      page: 'InsightPage',
      props: { ...appLayoutProps, holder: holder ?? null },
    },
  }
}
