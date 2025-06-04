import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getBridgesArchivedEntries } from '~/server/features/bridges/getBridgesArchivedEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
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
