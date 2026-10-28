import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getEcosystemEntry } from '~/server/features/ecosystems/getEcosystemEntry'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { optionToRange } from '~/utils/range/range'

export async function getEcosystemProjectData(
  manifest: Manifest,
  slug: string,
  url: string,
): Promise<RenderData | undefined> {
  const helpers = getSsrHelpers()
  const [appLayoutProps, ecosystem] = await Promise.all([
    getAppLayoutProps(),
    getEcosystemEntry(slug),
  ])

  if (!ecosystem) {
    return undefined
  }

  // The charts render on the server only with their data dehydrated under
  // the inputs of their first browser render.
  const chartRange = optionToRange('1y')
  const projectIds = ecosystem.liveProjects.map((p) => p.id).toSorted()
  await Promise.all([
    helpers.queryClient.prefetchQuery(
      helpers.trpc.tvs.chart.queryOptions({
        range: chartRange,
        excludeAssociatedTokens: false,
        excludeRwaRestrictedTokens: true,
        filter: { type: 'projects', projectIds },
      }),
    ),
    helpers.queryClient.prefetchQuery(
      helpers.trpc.activity.chart.queryOptions({
        range: chartRange,
        filter: { type: 'projects', projectIds },
      }),
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: ecosystem.name,
        description: `Get an overview of the scaling projects in the ${ecosystem.name} ecosystem.`,
        url,
        openGraph: {
          image: `/meta-images/ecosystems/${ecosystem.id}/opengraph-image.png`,
        },
      }),
    },
    ssr: {
      page: 'EcosystemProjectPage',
      props: {
        ...appLayoutProps,
        ecosystem,
        chartRange,
        queryState: helpers.dehydrate(),
      },
    },
  }
}
