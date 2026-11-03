import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { NEW_NAME } from './newNameText'

export async function getNewNameData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: NEW_NAME.title,
        description:
          'L2BEAT is now ETHBEAT: why we renamed, what we cover now beyond layer 2s, and what changes for links, the API and badges.',
        url,
        openGraph: {
          image: '/meta-images/l2beat-is-now-ethbeat/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'NewNamePage',
      props: appLayoutProps,
    },
  }
}
