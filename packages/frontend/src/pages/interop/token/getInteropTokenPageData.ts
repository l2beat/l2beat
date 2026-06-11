import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getInteropTokenData } from '~/server/features/scaling/interop/getInteropTokenData'
import { getAbstractTokenSlug } from '~/server/features/scaling/interop/token/getAbstractTokenSlug'
import { getInteropAbstractTokens } from '~/server/features/scaling/interop/token/getInteropAbstractTokens'
import { getInteropTokenDeployments } from '~/server/features/scaling/interop/token/getInteropTokenDeployments'
import { getInteropTokenEntry } from '~/server/features/scaling/interop/token/getInteropTokenEntry'
import { resolveInteropTokenBySlug } from '~/server/features/scaling/interop/token/resolveInteropTokenBySlug'
import { getInteropChains } from '~/server/features/scaling/interop/utils/getInteropChains'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import type { InteropQuery } from '../InteropRouter'
import { getInitialInteropSelection } from '../utils/getInitialInteropSelection'
import { mapInteropChainsToWithIcons } from '../utils/mapInteropChainsToWithIcons'
import type { InteropSelection } from '../utils/types'

export async function getInteropTokenPageData(
  req: Request<{ slug: string }, unknown, unknown, InteropQuery>,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData | undefined> {
  const appLayoutProps = await getAppLayoutProps()
  const interopChains = getInteropChains()
  const activeInteropChains = interopChains.filter((chain) => !chain.isUpcoming)
  const activeInteropChainIds = activeInteropChains.map((chain) => chain.id)
  const interopChainsWithIcons = mapInteropChainsToWithIcons(
    manifest,
    activeInteropChains,
  )

  const initialSelection = getInitialInteropSelection({
    query: req.query,
    interopChainsIds: activeInteropChainIds,
  })

  const data = await cache.get(
    {
      key: [
        'interop',
        'tokens',
        req.params.slug,
        initialSelection.from.join(','),
        initialSelection.to.join(','),
      ],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    () =>
      getCachedData({
        slug: req.params.slug,
        initialSelection,
        activeInteropChainIds,
        interopChainsWithIcons,
      }),
  )

  if (!data) return undefined

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${data.token.symbol} - L2BEAT`,
        description: `Interoperability activity for ${data.token.symbol} across the Ethereum ecosystem.`,
        url: req.originalUrl,
        openGraph: {
          image: '/meta-images/interop/summary/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'InteropTokenPage',
      props: {
        ...appLayoutProps,
        token: {
          ...data.token,
          iconUrl: data.token.iconUrl ?? TOKEN_PLACEHOLDER_ICON_URL,
        },
        tokenEntry: data.tokenEntry,
        tokenData: data.tokenData,
        apiSelection: data.apiSelection,
        interopChains: interopChainsWithIcons,
        initialSelection,
      },
    },
  }
}

async function getCachedData({
  slug,
  initialSelection,
  activeInteropChainIds,
  interopChainsWithIcons,
}: {
  slug: string
  initialSelection: InteropSelection
  activeInteropChainIds: string[]
  interopChainsWithIcons: InteropChainWithIcon[]
}) {
  const abstractTokens = await getInteropAbstractTokens(activeInteropChainIds)
  const token = resolveInteropTokenBySlug(abstractTokens, slug)
  if (!token) return undefined

  const apiSelection = initialSelection

  const [tokenData, deployments] = await Promise.all([
    getInteropTokenData({
      tokenId: token.id,
      ...apiSelection,
    }),
    getInteropTokenDeployments(token.id),
  ])

  const tokenEntry = getInteropTokenEntry(
    token.id,
    interopChainsWithIcons,
    deployments,
  )

  return {
    token: {
      ...token,
      slug: getAbstractTokenSlug(token),
    },
    tokenEntry,
    tokenData,
    apiSelection,
  }
}
