import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getScalingProjectTvsBreakdownData as nextGetScalingProjectTvsBreakdownData } from '~/server/features/scaling/project/get-scaling-project-tvs-breakdown-data'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingProjectTvsBreakdownData(
  manifest: Manifest,
  slug: string,
  url: string,
): Promise<RenderData | undefined> {
  const [appLayoutProps, tvsBreakdownData] = await Promise.all([
    getAppLayoutProps(),
    nextGetScalingProjectTvsBreakdownData(slug),
  ])

  if (!tvsBreakdownData) {
    return undefined
  }

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
        tvsBreakdownData,
        ...appLayoutProps,
      },
    },
  }
}
