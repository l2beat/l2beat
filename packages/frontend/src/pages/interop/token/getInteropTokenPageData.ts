import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getAbstractTokenSlug } from '~/server/features/scaling/interop/token/getAbstractTokenSlug'
import { getInteropAbstractTokens } from '~/server/features/scaling/interop/token/getInteropAbstractTokens'
import { resolveInteropTokenBySlug } from '~/server/features/scaling/interop/token/resolveInteropTokenBySlug'
import { getInteropChains } from '~/server/features/scaling/interop/utils/getInteropChains'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import type { InteropQuery } from '../InteropRouter'
import { getInitialInteropSelection } from '../utils/getInitialInteropSelection'
import { toInteropApiSelection } from '../utils/toInteropApiSelection'
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

  const initialSelection = getInitialInteropSelection({
    query: req.query,
    interopChainsIds: activeInteropChainIds,
    mode: 'public',
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
      }),
  )

  if (!data) return undefined

  const interopChainsWithIcons: InteropChainWithIcon[] =
    activeInteropChains.map((chain) => ({
      ...chain,
      iconUrl: manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
    }))

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
        queryState: data.queryState,
        token: {
          ...data.token,
          iconUrl: data.token.iconUrl ?? TOKEN_PLACEHOLDER_ICON_URL,
        },
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
}: {
  slug: string
  initialSelection: InteropSelection
  activeInteropChainIds: string[]
}) {
  const abstractTokens = await getInteropAbstractTokens(activeInteropChainIds)
  const token = resolveInteropTokenBySlug(abstractTokens, slug)
  if (!token) return undefined

  const helpers = getSsrHelpers()
  const apiSelection = toInteropApiSelection(initialSelection, 'public')

  await helpers.interop.tokenDashboard.prefetch({
    tokenId: token.id,
    ...apiSelection,
  })

  return {
    queryState: helpers.dehydrate(),
    token: {
      ...token,
      slug: getAbstractTokenSlug(token),
    },
  }
}
