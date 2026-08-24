import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getL2RiskStateValidationEntries } from '~/server/features/layer2s/risks/state-validation/getL2RiskStateValidationEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getL2RiskStateValidationData(
  req: Request,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['layer2s', 'risk', 'state-validation', 'entries'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      getL2RiskStateValidationEntries,
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Risk Analysis - L2BEAT',
        description:
          'Understand the risks of Ethereum scaling solutions using L2BEAT’s assessments.',
        url: req.originalUrl,
        openGraph: {
          image:
            '/meta-images/layer2s/risks/state-validation/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'L2RiskStateValidationPage',
      props: {
        ...appLayoutProps,
        ...entries,
      },
    },
  }
}
