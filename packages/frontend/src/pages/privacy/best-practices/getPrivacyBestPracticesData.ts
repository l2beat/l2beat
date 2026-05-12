import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getCollectionEntry } from '~/content/getCollection'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getPrivacyBestPracticesData(
  manifest: Manifest,
  url: string,
): Promise<RenderData | undefined> {
  const appLayoutProps = await getAppLayoutProps()
  const content = getCollectionEntry('pages', 'privacy-best-practices')
  if (!content) {
    return undefined
  }

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Privacy best practices - L2BEAT',
        description:
          'Basic tips for using privacy protocols on Ethereum without accidentally linking deposits, withdrawals, and offchain identity.',
        url,
        openGraph: {
          image: '/images/privacy/best-practices-pools.png',
          type: 'article',
        },
      }),
    },
    ssr: {
      page: 'PrivacyBestPracticesPage',
      props: {
        ...appLayoutProps,
        content,
      },
    },
  }
}
