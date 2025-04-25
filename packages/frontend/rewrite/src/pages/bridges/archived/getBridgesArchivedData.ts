import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getBridgesArchivedEntries } from '~/server/features/bridges/get-bridges-archived-entries'
import type { Manifest } from '~/utils/Manifest'

export async function getBridgesArchivedData(
  manifest: Manifest,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getBridgesArchivedEntries(),
  ])

  return {
    head: {
      manifest,
      title: 'Archived Bridges - L2BEAT',
      description:
        'List of archived Ethereum bridges that are no longer actively maintained or have been discontinued.',
    },
    ssr: {
      page: 'BridgesArchivedPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
