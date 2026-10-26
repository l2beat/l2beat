import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getChainProjectEntry } from '~/server/features/chains/getChainProjectEntry'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { getChainProjectPath } from './paths'

export async function getChainProjectData(
  manifest: Manifest,
  slug: string,
  cache: InMemoryCache,
): Promise<RenderData | undefined> {
  const data = await cache.get(
    {
      key: ['projects', 'chain', slug],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    () => loadChainProjectPage(manifest, slug),
  )
  if (!data) return undefined
  return {
    head: data.head,
    ssr: {
      page: 'ChainProjectPage',
      props: data.props,
    },
  }
}

async function loadChainProjectPage(manifest: Manifest, slug: string) {
  const helpers = getSsrHelpers()
  const [appLayoutProps, entry] = await Promise.all([
    getAppLayoutProps(),
    getChainProjectEntry(slug, helpers),
  ])
  if (!entry) return undefined

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: entry.name,
        description: `Cross-chain volume and flows of ${entry.name}: the interop protocols and tokens moving value between ${entry.name} and other chains.`,
        url: getChainProjectPath(entry.slug),
        openGraph: {
          image: '/meta-images/interop/summary/opengraph-image.png',
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
