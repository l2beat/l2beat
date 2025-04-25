import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getScalingSummaryEntries } from '~/server/features/scaling/summary/get-scaling-summary-entries'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingSummaryData(
  manifest: Manifest,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getScalingSummaryEntries(),
  ])

  return {
    head: {
      manifest,
      title: 'Scaling Summary - L2BEAT',
      description:
        'Compare different Ethereum scaling solutions by their security, technology, and risk.',
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
