import {
  type Bridge,
  type Layer2,
  type Layer3,
  chainConverter,
  safeGetTokenByAssetId,
  toBackendProject,
} from '@l2beat/config'
import {
  assert,
  AssetId,
  type ProjectId,
  UnixTime,
  asNumber,
  notUndefined,
} from '@l2beat/shared-pure'
import { uniqBy } from 'lodash'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { env } from '~/env'
import { getLatestAmountForConfigurations } from '../breakdown/get-latest-amount-for-configurations'
import { getLatestPriceForConfigurations } from '../breakdown/get-latest-price-for-configurations'
import { getConfigMapping } from '../utils/get-config-mapping'

export type ProjectTokens = Record<ProjectTokenSource, ProjectToken[]>
export type ProjectToken = {
  assetId: AssetId
  address: string
  chain: string
  iconUrl: string
  name: string
  symbol: string
  source: ProjectTokenSource
}

type ProjectTokenSource = 'native' | 'canonical' | 'external'

export async function getTokensForProject(
  project: Layer2 | Layer3 | Bridge,
): Promise<ProjectTokens> {
  if (env.MOCK) {
    return toDisplayableTokens(project.id, getMockTokensForProject())
  }
  noStore()
  const cachedTokens = await getCachedTokensForProject(project)
  return toDisplayableTokens(project.id, cachedTokens)
}

const getCachedTokensForProject = cache(
  async (
    project: Layer2 | Layer3 | Bridge,
  ): Promise<Record<ProjectTokenSource, AssetId[]>> => {
    const backendProject = toBackendProject(project)
    const configMapping = getConfigMapping(backendProject)
    const targetTimestamp = UnixTime.now().toStartOf('hour').add(-2, 'hours')

    const [priceConfigs, amountConfigs] = await Promise.all([
      getLatestPriceForConfigurations(configMapping.prices, targetTimestamp),
      getLatestAmountForConfigurations(configMapping.amounts, targetTimestamp),
    ])

    const pricesMap = new Map(
      priceConfigs.prices.map((x) => [x.configId, x.priceUsd]),
    )

    const withUsdValue = amountConfigs.amounts
      .map((a) => {
        const config = configMapping.getAmountConfig(a.configId)
        const amountAsNumber = asNumber(a.amount, config.decimals)
        const priceConfig = configMapping.getPriceConfigFromAmountConfig(config)
        if (priceConfigs.excluded.has(priceConfig.configId)) {
          return undefined
        }
        const price = pricesMap.get(priceConfig.configId)
        assert(price, 'Price not found for id ' + priceConfig.configId)

        return {
          assetId: priceConfig.assetId,
          source: config.source,
          usdValue: amountAsNumber * price,
        }
      })
      .filter(notUndefined)

    withUsdValue.sort((a, b) => b.usdValue - a.usdValue)

    const unique = uniqBy(withUsdValue, (e) => e.assetId.toString())

    return groupBySource(unique)
  },
  ['topTokensForProjectV2'],
  { revalidate: 60 * UnixTime.MINUTE },
)

function getMockTokensForProject(): Record<ProjectTokenSource, AssetId[]> {
  return {
    canonical: [AssetId('1')],
    native: [AssetId('2')],
    external: [AssetId('3')],
  }
}

function groupBySource(
  tokens: { assetId: AssetId; source: ProjectTokenSource }[],
) {
  const canonical: AssetId[] = []
  const native: AssetId[] = []
  const external: AssetId[] = []

  for (const token of tokens) {
    switch (token.source) {
      case 'canonical':
        canonical.push(token.assetId)
        break
      case 'native':
        native.push(token.assetId)
        break
      case 'external':
        external.push(token.assetId)
        break
    }
  }

  return {
    canonical,
    native,
    external,
  }
}

function toDisplayableTokens(
  projectId: ProjectId,
  tokens: Record<ProjectTokenSource, AssetId[]>,
): ProjectTokens {
  return {
    canonical: tokens.canonical.map((assetId) =>
      toDisplayableToken(projectId, { assetId, source: 'canonical' }),
    ),
    native: tokens.native.map((assetId) =>
      toDisplayableToken(projectId, { assetId, source: 'native' }),
    ),
    external: tokens.external.map((assetId) =>
      toDisplayableToken(projectId, { assetId, source: 'external' }),
    ),
  }
}

function toDisplayableToken(
  projectId: ProjectId,
  {
    assetId,
    source,
  }: {
    assetId: AssetId
    source: 'native' | 'canonical' | 'external'
  },
): ProjectToken {
  const token = safeGetTokenByAssetId(assetId)
  assert(token, 'Token not found for asset id ' + assetId.toString())
  let symbol = token.symbol
  if (symbol === 'USDC' && source === 'canonical') {
    if (
      projectId.toString() === 'arbitrum' ||
      projectId.toString() === 'optimism'
    ) {
      symbol = 'USDC.e'
    } else if (projectId.toString() === 'base') {
      symbol = 'USDbC'
    }
  }

  const name = token.name
  const address = token.address ?? 'native'
  const iconUrl = token.iconUrl ?? ''

  return {
    assetId,
    address: address.toString(),
    iconUrl,
    name,
    symbol,
    chain: chainConverter.toName(token.chainId),
    source,
  }
}
