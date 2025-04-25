import type { Manifest } from 'rewrite/src/common/Manifest'
import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getScalingRiskEntries } from '~/server/features/scaling/risks/get-scaling-risk-entries'

export async function getScalingRiskData(
  manifest: Manifest,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getScalingRiskEntries(),
  ])

  return {
    head: {
      manifest,
      title: 'Scaling Risk Analysis - L2BEAT',
      description:
        'Detailed risk analysis of Ethereum scaling solutions, examining their security models and potential vulnerabilities.',
    },
    ssr: {
      page: 'ScalingRiskPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
