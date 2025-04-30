import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import { getOpengraph } from 'rewrite/src/ssr/head/getOpengraph'
import type { RenderData } from 'rewrite/src/ssr/server'
import type { Manifest } from '~/utils/Manifest'

export async function getAboutUsData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()

  return {
    head: {
      manifest,
      title: 'About Us - L2BEAT',
      description:
        'L2BEAT is an analytics and research website about Ethereum layer 2 scaling. Here you can learn more about who we are and what we do.',
      opengraph: getOpengraph(manifest, {
        url,
        image: '/meta-images/about-us/opengraph-image.png',
      }),
    },
    ssr: {
      page: 'AboutUsPage',
      props: appLayoutProps,
    },
  }
}
