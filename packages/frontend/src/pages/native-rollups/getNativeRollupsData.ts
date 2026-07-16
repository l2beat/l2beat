import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getCollection } from '~/content/getCollection'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getYouTubeVideoId } from '~/utils/youtube'
import type { Talk } from './components/MaterialsSection'

export async function getNativeRollupsData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const props = {
    ...(await getAppLayoutProps()),
    talks: getNativeRollupsTalks(),
    contributorImages: {
      lucaDonno: manifest.getImage('/images/native-rollups/luca-donno.jpg'),
      justinDrake: manifest.getImage('/images/native-rollups/justin-drake.jpg'),
    },
  }

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Native Rollups - L2BEAT',
        description:
          'Native rollups use proof-carrying transactions so Ethereum can verify L2 blocks with its own execution program and proof infrastructure.',
        url,
        openGraph: {
          image: '/meta-images/native-rollups/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'NativeRollupsPage',
      props,
    },
  }
}

function getNativeRollupsTalks(): Talk[] {
  return getCollection('external-publications')
    .filter((publication) =>
      publication.data.topics?.includes('native-rollups'),
    )
    .sort((a, b) => b.data.publishedOn.getTime() - a.data.publishedOn.getTime())
    .map((publication) => {
      const videoId = getYouTubeVideoId(publication.data.url)
      if (!videoId) {
        throw new Error(
          `Native rollups talk ${publication.id} must be a YouTube video`,
        )
      }
      return {
        label: publication.data.title,
        source: publication.data.source ?? 'L2BEAT',
        description: publication.data.description ?? '',
        videoId,
      }
    })
}
