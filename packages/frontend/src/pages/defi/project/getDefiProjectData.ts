import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getDefiProjectEntry } from '~/server/features/defi/project/getDefiProjectEntry'
import { getMetadata } from '~/ssr/head/getMetadata'
import { getProjectMetadataDescription } from '~/ssr/head/getProjectMetadataDescription'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

export async function getDefiProjectData(
  req: Request<{ slug: string }, unknown, unknown, { update?: string }>,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData | undefined> {
  const data = await cache.get(
    {
      key: ['defi', 'projects', req.params.slug],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    () => getCachedData(manifest, req.params.slug, req.originalUrl),
  )
  if (!data) return undefined

  return {
    head: data.head,
    ssr: {
      page: 'DefiProjectPage',
      props: {
        ...data.props,
        selectedUpdateId: req.query.update,
      },
    },
  }
}

async function getCachedData(manifest: Manifest, slug: string, url: string) {
  const helpers = getSsrHelpers()
  const [appLayoutProps, entry] = await Promise.all([
    getAppLayoutProps(),
    getDefiProjectEntry(slug, helpers),
  ])

  if (!entry) {
    return undefined
  }

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${entry.name} - DeFi - L2BEAT`,
        description: getProjectMetadataDescription({
          name: entry.name,
          display: {
            description: entry.description,
          },
        }),
        url,
        openGraph: {
          image: `/meta-images/defi/projects/${entry.slug}/opengraph-image.png`,
        },
      }),
    },
    props: {
      ...appLayoutProps,
      entry,
      queryState: helpers.dehydrate(),
    },
  }
}
