import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getCollection } from '~/content/getCollection'
import { getGovernancePublicationEntry } from '~/pages/governance/utils/getGovernancePublicationEntry'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getGovernancePublicationsData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()
  const publications = getCollection('publications')
    .sort((b, a) => a.data.publishedOn.getTime() - b.data.publishedOn.getTime())
    .map(getGovernancePublicationEntry)

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Governance publications - L2BEAT',
        description:
          'Explore publications from L2BEAT Governance, discover the latest insights, analyses, and updates on Layer 2 project governance, curated by our L2BEAT Governance Team',
        openGraph: {
          url,
          image: '/meta-images/governance/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'GovernancePublicationsPage',
      props: {
        ...appLayoutProps,
        publications,
      },
    },
  }
}
