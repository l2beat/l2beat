import type { Manifest } from 'rewrite/src/common/Manifest'
import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getDaThroughputEntries } from '~/server/features/data-availability/throughput/get-da-throughput-entries'

export async function getDataAvailabilityThroughputData(
  manifest: Manifest,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getDaThroughputEntries(),
  ])

  return {
    head: {
      manifest,
      title: 'Data Availability Throughput - L2BEAT',
      description:
        'Compare data throughput and capacity across different data availability solutions.',
    },
    ssr: {
      page: 'DataAvailabilityThroughputPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
