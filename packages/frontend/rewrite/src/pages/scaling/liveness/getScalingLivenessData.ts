import type { Manifest } from 'rewrite/src/common/Manifest'
import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getScalingLivenessEntries } from '~/server/features/scaling/liveness/get-scaling-liveness-entries'

export async function getScalingLivenessData(
  manifest: Manifest,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getScalingLivenessEntries(),
  ])

  return {
    head: {
      manifest,
      title: 'Scaling Liveness - L2BEAT',
      description:
        'Compare liveness and uptime metrics across different Ethereum scaling solutions.',
    },
    ssr: {
      page: 'ScalingLivenessPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
