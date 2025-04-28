import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getScalingUpcomingEntries } from '~/server/features/scaling/upcoming/get-scaling-upcoming-entries'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingUpcomingData(
  manifest: Manifest,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getScalingUpcomingEntries(),
  ])

  return {
    head: {
      manifest,
      title: 'Upcoming Scaling Solutions - L2BEAT',
      description:
        'Discover upcoming Ethereum scaling solutions that are in development or preparing for launch.',
    },
    ssr: {
      page: 'ScalingUpcomingPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
