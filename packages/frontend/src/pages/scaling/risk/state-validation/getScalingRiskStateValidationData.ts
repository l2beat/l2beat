import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ICache } from '~/server/cache/ICache'
import { getScalingRiskStateValidationEntries } from '~/server/features/scaling/risks/state-validation/getScalingRiskStateValidationEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingRiskStateValidationData(
  req: Request,
  manifest: Manifest,
  cache: ICache,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['scaling', 'risk', 'state-validation', 'entries'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      getScalingRiskStateValidationEntries,
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Risk Analysis - L2BEAT',
        description:
          'Understand the risks of Ethereum scaling solutions using L2BEAT’s assessments.',
        openGraph: {
          url: req.originalUrl,
          image: '/meta-images/scaling/risk-analysis/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'ScalingRiskStateValidationPage',
      props: {
        ...appLayoutProps,
        ...entries,
      },
    },
  }
}
