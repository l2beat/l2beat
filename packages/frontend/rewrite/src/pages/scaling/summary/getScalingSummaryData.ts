import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getScalingSummaryEntries } from '~/server/features/scaling/summary/get-scaling-summary-entries'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingSummaryData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getScalingSummaryEntries(),
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
      page: 'ScalingSummaryPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
