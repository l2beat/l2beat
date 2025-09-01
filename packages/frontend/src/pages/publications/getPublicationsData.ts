import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getCollection } from '~/content/getCollection'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getPublicationEntryFromGovernance } from './utils/getPublicationEntry'

export async function getPublicationsData(
  manifest: Manifest,
  url: string,
): Promise<RenderData | undefined> {
  const appLayoutProps = await getAppLayoutProps()
  const governancePublications = getCollection('governance-publications')
  const publications = governancePublications
    .map(getPublicationEntryFromGovernance)
    .sort((a, b) => b.publishedOn - a.publishedOn)

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Publications - L2BEAT',
        description:
          "L2BEAT's monthly overview of the Ethereum scaling ecosystem: key news, protocol updates, and metrics.",
        openGraph: {
          url,
          image: '/meta-images/monthly-updates/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'PublicationsPage',
      props: {
        ...appLayoutProps,
        publications,
      },
    },
  }
}
