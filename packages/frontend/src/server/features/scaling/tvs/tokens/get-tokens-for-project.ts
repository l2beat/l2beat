import { toBackendProject } from '@l2beat/backend-shared'
import type { Bridge, Layer2, Layer3 } from '@l2beat/config'
import { safeGetTokenByAssetId } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import {
  assert,
  AssetId,
  EthereumAddress,
  UnixTime,
  asNumber,
  notUndefined,
} from '@l2beat/shared-pure'
import { uniqBy } from 'lodash'
import { env } from '~/env'
import { ps } from '~/server/projects'
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
    return toDisplayableTokens(project.id, getMockTokensDataForProject())
  }
  const cachedTokens = await getTokensDataForProject(project)
  return toDisplayableTokens(project.id, cachedTokens)
}

async function getTokensDataForProject(
  project: Layer2 | Layer3 | Bridge,
): Promise<Record<ProjectTokenSource, AssetId[]>> {
  const backendProject = toBackendProject(project)

  const chains = (await ps.getProjects({ select: ['chainConfig'] })).map(
    (p) => p.chainConfig,
  )
  const configMapping = getConfigMapping(backendProject, chains)
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

      assert(
        price,
        `Price not found. Price configId: ${priceConfig.configId}, amount configId: ${a.configId}`,
      )

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
}

function getMockTokensDataForProject(): Record<ProjectTokenSource, AssetId[]> {
  return {
    canonical: [AssetId.ETH],
    native: [
      AssetId.create(
        'arbitrum',
        EthereumAddress('0x912CE59144191C1204E64559FE8253a0e49E6548'),
      ),
    ],
    external: [
      AssetId.create(
        'mode',
        EthereumAddress('0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A'),
      ),
    ],
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
    chain: token.chainName,
    source,
  }
}
