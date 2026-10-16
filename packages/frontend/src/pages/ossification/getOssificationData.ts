import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getCachedOssificationEntries } from '~/server/features/projects/ossification/getOssificationEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getOssificationData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getCachedOssificationEntries(),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Ossification - L2BEAT',
        description:
          'How long the critical contracts of each project have gone unchanged, and how much value they secured meanwhile.',
        url,
        openGraph: {
          image: '/meta-images/ossification/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'OssificationPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
