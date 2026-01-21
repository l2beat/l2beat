import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getCollectionEntry } from '~/content/getCollection'
import { getStaticAsset } from '~/server/features/utils/getProjectIcon'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { formatPublicationDate } from '~/utils/dates'
import type { Manifest } from '../../utils/Manifest'

export async function getStagesData(
  manifest: Manifest,
  url: string,
): Promise<RenderData | undefined> {
  const appLayoutProps = await getAppLayoutProps()
  const content = getCollectionEntry('pages', 'stages')
  if (!content) {
    return undefined
  }

  // Replace image path in markdown content with hashed URL
  const stagesImageUrl = getStaticAsset('/images/stages/optimal_stage.jpeg')
  const processedContent = {
    ...content,
    content: content.content.replace(
      /src="\/images\/stages\/optimal_stage\.jpeg"/g,
      `src="${stagesImageUrl}"`,
    ),
  }

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Stages - L2BEAT',
        description:
          'Discover the latest updates on L2BEAT’s Stages framework - the go-to system for assessing the maturity of rollups on Ethereum.',
        openGraph: {
          url,
          image: '/meta-images/stages/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'StagesPage',
      props: {
        ...appLayoutProps,
        content: processedContent,
        lastUpdated: formatPublicationDate(content.data.lastUpdated),
      },
    },
  }
}
