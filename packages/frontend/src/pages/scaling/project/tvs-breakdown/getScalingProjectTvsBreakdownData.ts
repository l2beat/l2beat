import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getScalingProjectTvsBreakdownData as nextGetScalingProjectTvsBreakdownData } from '~/server/features/scaling/project/get-scaling-project-tvs-breakdown-data'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getExpressHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingProjectTvsBreakdownData(
  manifest: Manifest,
  slug: string,
  url: string,
): Promise<RenderData | undefined> {
  const helpers = getExpressHelpers()
  const [appLayoutProps, tvsBreakdownData] = await Promise.all([
    getAppLayoutProps(),
    nextGetScalingProjectTvsBreakdownData(slug),
  ])

  if (!tvsBreakdownData) {
    return undefined
  }

  await helpers.tvs.chart.prefetch({
    filter: {
      type: 'projects',
      projectIds: [tvsBreakdownData.project.id.toString()],
    },
    excludeAssociatedTokens: false,
    previewRecategorisation: false,
    range: '1y',
  })

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${tvsBreakdownData.project.name} | TVS Breakdown - L2BEAT`,
        description: `See a detailed breakdown of ${tvsBreakdownData.project.name}'s TVS on L2BEAT.`,
        openGraph: {
          url,
          image: `/meta-images/scaling/projects/${tvsBreakdownData.project.slug}/opengraph-image.png`,
        },
      }),
    },
    ssr: {
      page: 'ScalingProjectTvsBreakdownPage',
      props: {
        ...appLayoutProps,
        tvsBreakdownData,
        queryState: helpers.dehydrate(),
      },
    },
  }
}
