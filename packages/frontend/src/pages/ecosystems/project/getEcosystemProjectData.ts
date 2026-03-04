import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getEcosystemEntry } from '~/server/features/ecosystems/getEcosystemEntry'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

export async function getEcosystemProjectData(
  req: Request<{ slug: string }, unknown, unknown, unknown>,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData | undefined> {
  const helpers = getSsrHelpers()
  const slug = req.params.slug
  if (!slug) return undefined

  const [appLayoutProps, ecosystem] = await Promise.all([
    getAppLayoutProps(req),
    cache.get(
      {
        key: ['ecosystems', slug],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      () => getEcosystemEntry(slug, helpers),
    ),
  ])

  if (!ecosystem) {
    return undefined
  }

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${ecosystem.name} - L2BEAT`,
        description: `Get an overview of the scaling projects in the ${ecosystem.name} ecosystem.`,
        openGraph: {
          url: req.originalUrl,
          image: `/meta-images/ecosystems/${ecosystem.id}/opengraph-image.png`,
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
