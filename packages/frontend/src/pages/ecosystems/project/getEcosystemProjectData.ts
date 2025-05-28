import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getEcosystemEntry } from '~/server/features/ecosystems/get-ecosystem-entry'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getExpressHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

export async function getEcosystemProjectData(
  manifest: Manifest,
  slug: string,
  url: string,
): Promise<RenderData | undefined> {
  const helpers = getExpressHelpers()
  const [appLayoutProps, ecosystem] = await Promise.all([
    getAppLayoutProps(),
    getEcosystemEntry(slug),
  ])

  if (!ecosystem) {
    return undefined
  }

  await Promise.all([
    helpers.tvs.chart.prefetch({
      range: '1y',
      excludeAssociatedTokens: false,
      filter: {
        type: 'projects',
        projectIds: ecosystem.projects.map((project) => project.id),
      },
      previewRecategorisation: false,
    }),
    helpers.activity.chart.prefetch({
      range: '1y',
      filter: {
        type: 'projects',
        projectIds: ecosystem.projects.map((project) => project.id),
      },
      previewRecategorisation: false,
    }),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${ecosystem.name} - L2BEAT`,
        openGraph: {
          url,
        },
      }),
    },
    ssr: {
      page: 'EcosystemProjectPage',
      props: {
        ...appLayoutProps,
        ecosystem,
        queryState: helpers.dehydrate(),
      },
    },
  }
}
