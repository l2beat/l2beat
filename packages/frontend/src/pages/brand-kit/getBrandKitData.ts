import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getBrandKitData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Brand Kit - L2BEAT',
        description: 'L2BEAT brand guidelines, logos, and assets for download.',
        openGraph: {
          url,
        },
      }),
    },
    ssr: {
      page: 'BrandKitPage',
      props: appLayoutProps,
    },
  }
}
