import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getDaArchivedEntries } from '~/server/features/data-availability/archived/getDaArchivedEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getDataAvailabilityArchivedData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getDaArchivedEntries(),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        openGraph: {
          url,
          image: '/meta-images/data-availability/archived/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'DataAvailabilityArchivedPage',
      props: {
        ...appLayoutProps,
        ...entries,
      },
    },
  }
}
