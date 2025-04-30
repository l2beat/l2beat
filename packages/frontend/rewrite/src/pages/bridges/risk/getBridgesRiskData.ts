import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getBridgesRiskEntries } from '~/server/features/bridges/get-bridges-risk-entries'
import type { Manifest } from '~/utils/Manifest'

export async function getBridgesRiskData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getBridgesRiskEntries(),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        openGraph: {
          url,
        },
      }),
    },
    ssr: {
      page: 'BridgesRiskPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
