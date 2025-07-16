import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getScalingProjectTvsBreakdown } from '~/server/features/scaling/project/getScalingProjectTvsBreakdown'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingProjectTvsBreakdownData(
  manifest: Manifest,
  slug: string,
  url: string,
): Promise<RenderData | undefined> {
  const helpers = getSsrHelpers()
  const [appLayoutProps, tvsBreakdownData] = await Promise.all([
    getAppLayoutProps(),
    getScalingProjectTvsBreakdown(slug),
  ])

  if (!tvsBreakdownData) {
    return undefined
  }

  const range = tvsBreakdownData.project.archivedAt ? 'max' : '1y'

  await helpers.tvs.chart.prefetch({
    filter: {
      type: 'projects',
      projectIds: [tvsBreakdownData.project.id.toString()],
    },
    excludeAssociatedTokens: false,
    range: { type: range },
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
        defaultRange: range,
      },
    },
  }
}
