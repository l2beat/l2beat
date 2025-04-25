import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getScalingDaEntries } from '~/server/features/scaling/data-availability/get-scaling-da-entries'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingDataAvailabilityData(
  manifest: Manifest,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getScalingDaEntries(),
  ])

  return {
    head: {
      manifest,
      title: 'Scaling Data Availability - L2BEAT',
      description:
        'Compare data availability solutions and strategies across different Ethereum scaling solutions.',
    },
    ssr: {
      page: 'ScalingDataAvailabilityPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
