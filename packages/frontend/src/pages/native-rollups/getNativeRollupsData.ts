import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getCollection } from '~/content/getCollection'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getImageParams } from '~/utils/project/getImageParams'
import { CONTRIBUTORS, type Contributor } from './contributors'
import type { Talk } from './materials'

export async function getNativeRollupsData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const props = {
    ...(await getAppLayoutProps()),
    talks: getNativeRollupsTalks(),
    contributors: CONTRIBUTORS.map(
      ({ imagePath, ...contributor }): Contributor => ({
        ...contributor,
        image: manifest.getImage(imagePath),
      }),
    ),
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
      const { title, url, source, description } = publication.data
      const thumbnail = getImageParams(
        `/meta-images/publications/${publication.id}.png`,
      )
      if (!thumbnail || !source || !description) {
        throw new Error(
          `Native rollups talk ${publication.id} must have a generated thumbnail, a source, and a description`,
        )
      }
      return {
        kind: 'talk' as const,
        label: title,
        source,
        description,
        href: url,
        thumbnail,
      }
    })
}
