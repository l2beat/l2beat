import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getScalingProjectTvsBreakdown } from '~/server/features/scaling/project/getScalingProjectTvsBreakdown'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { optionToRange } from '~/utils/range/range'

export async function getScalingProjectTvsBreakdownData(
  req: Request,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData | undefined> {
  const slug = req.params.slug
  if (!slug) return undefined

  const [appLayoutProps, tvsBreakdownData] = await Promise.all([
    getAppLayoutProps(req),
    cache.get(
      {
        key: ['scaling', 'projects', slug, 'tvs-breakdown'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      () => getScalingProjectTvsBreakdown(slug),
    ),
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
        openGraph: {
          url: req.originalUrl,
          image: `/meta-images/scaling/projects/${tvsBreakdownData.project.slug}/opengraph-image.png`,
        },
      }),
    },
    ssr: {
      page: 'ScalingProjectTvsBreakdownPage',
      props: {
        ...appLayoutProps,
        ...tvsBreakdownData,
        defaultRange: range,
      },
    },
  }
}
