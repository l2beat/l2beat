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
  EthereumAddress,
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
    return getMockTokensForProject()
  }
  noStore()
  return getCachedTokensForProject(project)
}

const getCachedTokensForProject = cache(
  async (project: Layer2 | Layer3 | Bridge): Promise<ProjectTokens> => {
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

    const displayable = uniqBy(withUsdValue, (e) => e.assetId.toString())
      .map((token) => toDisplayableTokens(backendProject.projectId, token))
      .filter(notUndefined)

    return groupBySource(displayable)
  },
  ['topTokensForProject'],
  { revalidate: 60 * UnixTime.MINUTE },
)

function getMockTokensForProject(): ProjectTokens {
  return {
    canonical: [
      {
        address: EthereumAddress.random().toString(),
        assetId: AssetId('1'),
        chain: 'ethereum',
        iconUrl:
          'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
        name: 'Canonical Token',
        symbol: 'TKN',
        source: 'canonical',
      },
    ],
    native: [
      {
        address: EthereumAddress.random().toString(),
        assetId: AssetId('2'),
        chain: 'ethereum',
        iconUrl:
          'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
        name: 'Native Token',
        symbol: 'TKN',
        source: 'native',
      },
    ],
    external: [
      {
        address: EthereumAddress.random().toString(),
        assetId: AssetId('3'),
        chain: 'ethereum',
        iconUrl:
          'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
        name: 'External Token',
        symbol: 'TKN',
        source: 'external',
      },
    ],
  }
}

function groupBySource(tokens: ProjectToken[]) {
  const canonical: ProjectToken[] = []
  const native: ProjectToken[] = []
  const external: ProjectToken[] = []

  for (const token of tokens) {
    switch (token.source) {
      case 'canonical':
        canonical.push(token)
        break
      case 'native':
        native.push(token)
        break
      case 'external':
        external.push(token)
        break
    }
  }

  return {
    canonical: canonical.slice(0, 10),
    native: native.slice(0, 10),
    external: external.slice(0, 10),
  }
}

function toDisplayableTokens(
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
