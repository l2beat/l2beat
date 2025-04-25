import type { Manifest } from 'rewrite/src/common/Manifest'
import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { RenderData } from 'rewrite/src/ssr/server'

export async function getAboutUsData(manifest: Manifest): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()

  return {
    head: {
      manifest,
      title: 'About Us - L2BEAT',
      description:
        'L2BEAT is an analytics and research website about Ethereum layer 2 scaling. Here you can learn more about who we are and what we do.',
    },
    ssr: {
      page: 'AboutUsPage',
      props: appLayoutProps,
    },
  }
}
