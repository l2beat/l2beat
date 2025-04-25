import type { Manifest } from 'rewrite/src/common/Manifest'
import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getDaSummaryEntries } from '~/server/features/data-availability/summary/get-da-summary-entries'
import { getDaThroughputSummary } from '~/server/features/data-availability/throughput/get-da-throughput-summary'

export async function getDataAvailabilitySummaryData(
  manifest: Manifest,
): Promise<RenderData> {
  const [
    appLayoutProps,
    { publicSystems, customSystems },
    throughputSummaryData,
  ] = await Promise.all([
    getAppLayoutProps(),
    getDaSummaryEntries(),
    getDaThroughputSummary(),
  ])

  return {
    head: {
      manifest,
      title: 'Data Availability Summary - L2BEAT',
      description:
        'L2BEAT - an analytics and research website about Ethereum layer 2 scaling.',
    },
    ssr: {
      page: 'DataAvailabilitySummaryPage',
      props: {
        ...appLayoutProps,
        publicSystems,
        customSystems,
        throughputSummaryData,
      },
    },
  }
}
