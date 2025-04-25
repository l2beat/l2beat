import type { Manifest } from 'rewrite/src/common/Manifest'
import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getScalingProjectTvsBreakdownData as nextGetScalingProjectTvsBreakdownData } from '~/server/features/scaling/project/get-scaling-project-tvs-breakdown-data'

export async function getScalingProjectTvsBreakdownData(
  manifest: Manifest,
  slug: string,
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
      title: `${tvsBreakdownData.project.name} | TVS Breakdown - L2BEAT`,
      description: `${tvsBreakdownData.project.name} project TVS Breakdown overview on L2BEAT. In depth scaling protocol analysis. Ethereum scaling analytics and research.`,
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
