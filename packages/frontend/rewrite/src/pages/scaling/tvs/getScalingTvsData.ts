import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import type { Manifest } from 'rewrite/src/common/Manifest'
import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getScalingTvsEntries } from '~/server/features/scaling/tvs/get-scaling-tvs-entries'

export async function getScalingTvsData(
  manifest: Manifest,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getScalingTvsEntries(),
  ])

  return {
    head: {
      manifest,
      title: 'Total Value Secured - L2BEAT',
      description:
        'Track and compare the total value secured by different Ethereum scaling solutions.',
    },
    ssr: {
      page: 'ScalingTvsPage',
      props: {
        ...appLayoutProps,
        entries,
        milestones: HOMEPAGE_MILESTONES,
      },
    },
  }
}
