import type { Manifest } from 'rewrite/src/common/Manifest'
import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getScalingFinalityEntries } from '~/server/features/scaling/finality/get-scaling-finality-entries'

export async function getScalingFinalityData(
  manifest: Manifest,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getScalingFinalityEntries(),
  ])

  return {
    head: {
      manifest,
      title: 'Scaling Finality - L2BEAT',
      description:
        'Compare finality times and mechanisms across different Ethereum scaling solutions.',
    },
    ssr: {
      page: 'ScalingFinalityPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
