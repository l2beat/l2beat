import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getBridgesRiskEntries } from '~/server/features/bridges/get-bridges-risk-entries'
import type { Manifest } from '~/utils/Manifest'

export async function getBridgesRiskData(
  manifest: Manifest,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getBridgesRiskEntries(),
  ])

  return {
    head: {
      manifest,
      title: 'Bridge Risk Analysis - L2BEAT',
      description:
        'Detailed risk analysis of Ethereum bridges, examining their security models and potential vulnerabilities.',
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
