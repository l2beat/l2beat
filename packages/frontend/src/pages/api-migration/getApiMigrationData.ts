import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getApiMigrationGuide } from './apiMigrationGuide'

export async function getApiMigrationData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()
  const guide = getApiMigrationGuide()

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: guide.title,
        description:
          'ETHBEAT data now comes from a documented API with an OpenAPI schema and Swagger docs. How to move each /api/scaling endpoint, now shut down, to api.ethbeat.org.',
        url,
        openGraph: { image: '/meta-images/home/opengraph-image.png' },
      }),
    },
    ssr: {
      page: 'ApiMigrationPage',
      props: {
        ...appLayoutProps,
        guide,
      },
    },
  }
}
