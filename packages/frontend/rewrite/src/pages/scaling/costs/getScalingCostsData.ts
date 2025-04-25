import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import type { Manifest } from 'rewrite/src/common/Manifest'
import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getScalingCostsEntries } from '~/server/features/scaling/costs/get-scaling-costs-entries'

export async function getScalingCostsData(
  manifest: Manifest,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getScalingCostsEntries(),
  ])

  return {
    head: {
      manifest,
      title: 'Scaling Costs - L2BEAT',
      description:
        'Compare transaction costs and fees across different Ethereum scaling solutions.',
    },
    ssr: {
      page: 'ScalingCostsPage',
      props: {
        ...appLayoutProps,
        entries,
        milestones: HOMEPAGE_MILESTONES,
      },
    },
  }
}
