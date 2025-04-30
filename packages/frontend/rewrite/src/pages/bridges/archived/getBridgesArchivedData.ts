import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getBridgesArchivedEntries } from '~/server/features/bridges/get-bridges-archived-entries'
import type { Manifest } from '~/utils/Manifest'

export async function getBridgesArchivedData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getBridgesArchivedEntries(),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        openGraph: {
          url,
        },
      }),
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
