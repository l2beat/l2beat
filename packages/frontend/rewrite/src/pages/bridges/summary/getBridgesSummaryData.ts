import type { Manifest } from 'rewrite/src/common/Manifest'
import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getBridgesSummaryEntries } from '~/server/features/bridges/get-bridges-summary-entries'

export async function getBridgesSummaryData(
  manifest: Manifest,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getBridgesSummaryEntries(),
  ])

  return {
    head: {
      manifest,
      title: 'Bridge Summary - L2BEAT',
      description:
        'Compare different Ethereum bridges by their security, technology, and risk.',
    },
    ssr: {
      page: 'BridgesSummaryPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
