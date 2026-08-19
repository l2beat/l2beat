import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getL2ProjectTvsBreakdown } from '~/server/features/layer2s/project/getL2ProjectTvsBreakdown'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { optionToRange } from '~/utils/range/range'

export async function getL2ProjectTvsBreakdownData(
  manifest: Manifest,
  slug: string,
  url: string,
): Promise<RenderData | undefined> {
  const [appLayoutProps, tvsBreakdownData] = await Promise.all([
    getAppLayoutProps(),
    getL2ProjectTvsBreakdown(slug),
  ])

  if (!tvsBreakdownData) {
    return undefined
  }

  const range = tvsBreakdownData.project.archivedAt
    ? optionToRange('max')
    : optionToRange('1y')

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${tvsBreakdownData.project.name} | TVS Breakdown - L2BEAT`,
        description: `See a detailed breakdown of ${tvsBreakdownData.project.name}'s TVS on L2BEAT.`,
        url,
        openGraph: {
          image: `/meta-images/layer2s/projects/${tvsBreakdownData.project.slug}/opengraph-image.png`,
        },
      }),
    },
    ssr: {
      page: 'L2ProjectTvsBreakdownPage',
      props: {
        ...appLayoutProps,
        ...tvsBreakdownData,
        defaultRange: range,
      },
    },
  }
}
