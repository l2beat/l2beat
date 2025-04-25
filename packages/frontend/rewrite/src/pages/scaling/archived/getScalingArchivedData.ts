import type { Manifest } from 'rewrite/src/common/Manifest'
import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getScalingArchivedEntries } from '~/server/features/scaling/archived/get-scaling-archived-entries'

export async function getScalingArchivedData(
  manifest: Manifest,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getScalingArchivedEntries(),
  ])

  return {
    head: {
      manifest,
      title: 'Archived Scaling Solutions - L2BEAT',
      description:
        'List of archived Ethereum scaling solutions that are no longer actively maintained or have been discontinued.',
    },
    ssr: {
      page: 'ScalingArchivedPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
