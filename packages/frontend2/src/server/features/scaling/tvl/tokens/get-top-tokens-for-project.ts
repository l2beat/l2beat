import {
  type Bridge,
  ConfigMapping,
  type Layer2,
  type Layer3,
  chainConverter,
  getTvlAmountsConfigForProject,
  getTvlPricesConfig,
  safeGetTokenByAssetId,
  toBackendProject,
} from '@l2beat/config'
import {
  assert,
  type AssetId,
  type ProjectId,
  UnixTime,
  asNumber,
  notUndefined,
} from '@l2beat/shared-pure'
import { uniqBy } from 'lodash'
import { getLatestAmountForConfigurations } from '../breakdown/get-latest-amount-for-configurations'
import { getLatestPriceForConfigurations } from '../breakdown/get-latest-price-for-configurations'

export type ProjectTokens = Record<ProjectTokenSource, ProjectToken[]>
export type ProjectToken = {
  assetId: AssetId
  address: string
  chain: string
  iconUrl: string
  name: string
  symbol: string
  source: ProjectTokenSource
  usdValue: number
}

type ProjectTokenSource = 'native' | 'canonical' | 'external'

export async function getTopTokensForProject(
  project: Layer2 | Layer3 | Bridge,
): Promise<ProjectTokens> {
  const backendProject = toBackendProject(project)

  const amountsConfigs = getTvlAmountsConfigForProject(backendProject)
  const priceConfigs = getTvlPricesConfig()

  const configMapping = new ConfigMapping(priceConfigs, amountsConfigs, [
    backendProject.projectId,
  ])

  const targetTimestamp = UnixTime.now().toStartOf('hour').add(-2, 'hours')

  const prices = await getLatestPriceForConfigurations(
    configMapping.prices,
    targetTimestamp,
  )

  const tokenAmounts = await getLatestAmountForConfigurations(
    configMapping.amounts,
    targetTimestamp,
  )

  const pricesMap = new Map(prices.prices.map((x) => [x.configId, x.priceUsd]))

  const mapped = tokenAmounts.amounts
    .map((a) => {
      const config = configMapping.getAmountConfig(a.configId)
      const amountAsNumber = asNumber(a.amount, config.decimals)
      const priceConfig = configMapping.getPriceConfigFromAmountConfig(config)
      if (prices.excluded.has(priceConfig.configId)) {
        return undefined
      }
      const price = pricesMap.get(priceConfig.configId)
      assert(price, 'Price not found for id ' + priceConfig.configId)

      return {
        assetId: priceConfig.assetId,
        address: config.address,
        chain: config.chain,
        chainId: chainConverter.toChainId(config.chain),
        source: config.source,
        usdValue: amountAsNumber * price,
      }
    })
    .filter(notUndefined)

  mapped.sort((a, b) => b.usdValue - a.usdValue)

  const displayable = uniqBy(mapped, (e) => e.assetId.toString())
    .map((token) => toDisplayableTokens(backendProject.projectId, token))
    .filter(notUndefined)

  const canonical: ProjectToken[] = []
  const native: ProjectToken[] = []
  const external: ProjectToken[] = []

  for (const token of displayable) {
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
    canonical,
    native,
    external,
  }
}

export function toDisplayableTokens(
  projectId: ProjectId,
  {
    assetId,
    source,
    usdValue,
  }: {
    assetId: AssetId
    source: 'native' | 'canonical' | 'external'
    usdValue: number
  },
) {
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
    address: address?.toString(),
    iconUrl,
    name,
    symbol,
    chain: chainConverter.toName(token.chainId),
    source,
    usdValue,
  }
}
