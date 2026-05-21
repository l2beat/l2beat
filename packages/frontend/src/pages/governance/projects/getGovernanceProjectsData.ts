import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getGovernanceProjectsEntries } from '~/server/features/governance/getGovernanceProjectsEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getGovernanceProjectsData(
  req: Request,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['governance', 'projects', 'entries'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      getGovernanceProjectsEntries,
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Governance - L2BEAT',
        description:
          'Compare governance setups across Ethereum scaling projects: funds custody, tx processing, censorship guarantee, exit window, and privacy.',
        url: req.originalUrl,
        openGraph: {
          image: '/meta-images/governance/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'GovernanceProjectsPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
