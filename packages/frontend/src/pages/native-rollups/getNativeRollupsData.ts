import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getNativeRollupsData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Native Rollups - L2BEAT',
        description:
          "Native rollups reuse Ethereum's own execution via the EXECUTE precompile — the easiest and most secure way to deploy your own EVM chain.",
        url,
        openGraph: {
          // TODO: replace with a dedicated native-rollups OpenGraph image.
          image: '/meta-images/governance/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'NativeRollupsPage',
      props: {
        ...appLayoutProps,
      },
    },
  }
}
