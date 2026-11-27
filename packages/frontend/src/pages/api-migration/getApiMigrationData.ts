import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import {
  API_MIGRATION_GUIDE_TITLE,
  getApiMigrationGuideMarkdown,
} from './getApiMigrationGuideMarkdown'

export async function getApiMigrationData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: API_MIGRATION_GUIDE_TITLE,
        description:
          'The /api/scaling endpoints are being retired. How to move each one to the ETHBEAT API at api.ethbeat.org: new paths, project ids, field names and differences in the numbers.',
        url,
        openGraph: { image: '/meta-images/home/opengraph-image.png' },
      }),
    },
    ssr: {
      page: 'ApiMigrationPage',
      props: {
        ...appLayoutProps,
        title: API_MIGRATION_GUIDE_TITLE,
        markdown: getApiMigrationGuideMarkdown(),
      },
    },
  }
}
