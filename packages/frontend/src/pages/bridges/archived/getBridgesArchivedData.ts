import { getBridgesArchivedEntries } from 'rewrite/src/server/features/bridges/get-bridges-archived-entries'
import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import type { RenderData } from 'rewrite/src/ssr/types'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
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
          image: '/meta-images/bridges/archived/opengraph-image.png',
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
