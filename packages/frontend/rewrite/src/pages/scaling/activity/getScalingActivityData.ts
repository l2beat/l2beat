import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import type { Manifest } from 'rewrite/src/common/Manifest'
import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getScalingActivityEntries } from '~/server/features/scaling/activity/get-scaling-activity-entries'

export async function getScalingActivityData(
  manifest: Manifest,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getScalingActivityEntries(),
  ])

  return {
    head: {
      manifest,
      title: 'Scaling Activity - L2BEAT',
      description:
        'Track and compare transaction activity across different Ethereum scaling solutions.',
    },
    ssr: {
      page: 'ScalingActivityPage',
      props: {
        ...appLayoutProps,
        entries,
        milestones: HOMEPAGE_MILESTONES,
      },
    },
  }
}
