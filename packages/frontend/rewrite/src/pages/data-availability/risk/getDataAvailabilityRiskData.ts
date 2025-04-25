import type { Manifest } from 'rewrite/src/common/Manifest'
import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getDaRiskEntries } from '~/server/features/data-availability/risks/get-da-risk-entries'

export async function getDataAvailabilityRiskData(
  manifest: Manifest,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getDaRiskEntries(),
  ])

  return {
    head: {
      manifest,
      title: 'Data Availability Risk Analysis - L2BEAT',
      description:
        'Detailed risk analysis of data availability solutions, examining their security models and potential vulnerabilities.',
    },
    ssr: {
      page: 'DataAvailabilityRiskPage',
      props: {
        ...appLayoutProps,
        ...entries,
      },
    },
  }
}
