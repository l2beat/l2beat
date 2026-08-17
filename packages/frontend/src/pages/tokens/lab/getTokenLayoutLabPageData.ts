import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import {
  getInteropTokenOnchainDeployments,
  type InteropTokenOnchainDeployment,
} from '~/server/features/scaling/interop/token/getInteropTokenOnchainDeployments'
import type { InteropTokenRelationsGraph } from '~/server/features/scaling/interop/token/getInteropTokenRelationsGraph'
import { getInteropChains } from '~/server/features/scaling/interop/utils/getInteropChains'
import { getTokenRelationsGraphById } from '~/server/features/tokens/getTokenRelationsGraphById'
import { getTokenDb } from '~/server/tokenDb'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

const TOKENS = [
  { id: '9HN5PN', symbol: 'USDC' },
  { id: 'xxeNQv', symbol: 'USDT' },
  { id: 'C0Hmkq', symbol: 'ETH' },
  { id: 'tmyD4t', symbol: 'USDe' },
] as const

export interface TokenLayoutLabToken {
  id: string
  symbol: string
  issuer: string | null
  iconUrl: string | null
  graph: InteropTokenRelationsGraph
  deployments: InteropTokenOnchainDeployment[]
}

export async function getTokenLayoutLabPageData(
  manifest: Manifest,
  url: string,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, tokens] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['selected-token-panel-lab'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      getLabTokens,
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Selected token panel lab - L2BEAT',
        description:
          'Side-by-side treatments for the selected-token details panel.',
        url,
        openGraph: { image: '/meta-images/tokens/opengraph-image.png' },
        excludeFromSearchEngines: true,
      }),
    },
    ssr: {
      page: 'TokenLayoutLabPage',
      props: { ...appLayoutProps, tokens },
    },
  }
}

async function getLabTokens(): Promise<TokenLayoutLabToken[]> {
  const ids = TOKENS.map((token) => token.id)
  const activeChainIds = getInteropChains()
    .filter((chain) => !chain.isUpcoming)
    .map((chain) => chain.id)
  const [summaries, tokenData] = await Promise.all([
    getTokenDb().abstractToken.getByIds(ids),
    Promise.all(
      ids.map(async (id) => {
        const [graph, deployments] = await Promise.all([
          getTokenRelationsGraphById(id),
          getInteropTokenOnchainDeployments(id, activeChainIds),
        ])
        return { graph, deployments }
      }),
    ),
  ])
  const summariesById = new Map(summaries.map((token) => [token.id, token]))

  return TOKENS.map((token, index) => {
    const summary = summariesById.get(token.id)
    return {
      id: token.id,
      symbol: summary?.symbol ?? token.symbol,
      issuer: summary?.issuer ?? null,
      iconUrl: summary?.iconUrl ?? null,
      graph: tokenData[index]?.graph as InteropTokenRelationsGraph,
      deployments: tokenData[index]?.deployments ?? [],
    }
  })
}
