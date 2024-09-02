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
import { getLatestAmountForConfigurations } from '../breakdown/get-latest-amount-for-configurations'
import { getLatestPriceForConfigurations } from '../breakdown/get-latest-price-for-configurations'

export type ProjectTokens = {
  canonical: ProjectToken[]
  external: ProjectToken[]
  native: ProjectToken[]
}
export type ProjectToken = {
  assetId: AssetId
  address: string
  chain: string
  iconUrl: string
  name: string
  symbol: string
  source: 'native' | 'canonical' | 'external'
  usdValue: number
}

export async function getTopTokensForProject(
  project: Layer2 | Layer3 | Bridge,
) {
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

  const canonical = []
  const external = []
  const native = []
  for (const token of mapped) {
    const source = token.source
    switch (source) {
      case 'canonical': {
        if (canonical.length >= 15) continue
        canonical.push(token)
        break
      }
      case 'external': {
        if (external.length >= 15) continue
        external.push(token)
        break
      }
      case 'native': {
        if (native.length >= 15) continue
        native.push(token)
        break
      }
    }
  }

  return {
    canonical: canonical
      .map((token) => toDisplayableTokens(backendProject.projectId, token))
      .filter(notUndefined),
    external: external
      .map((token) => toDisplayableTokens(backendProject.projectId, token))
      .filter(notUndefined),
    native: native
      .map((token) => toDisplayableTokens(backendProject.projectId, token))
      .filter(notUndefined),
  }
}

export function toDisplayableTokens(
  projectId: ProjectId,
  {
    assetId,
    source,
    chain,
    usdValue,
  }: {
    assetId: AssetId
    source: 'native' | 'canonical' | 'external'
    chain: string
    usdValue: number
  },
) {
  const token = safeGetTokenByAssetId(assetId)
  let symbol = token?.symbol
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
  const name = token?.name
  const address = token?.address ?? 'native'
  const iconUrl = token?.iconUrl ?? ''

  // TODO: this is just temporary, so CI passes
  assert(chain, 'Chain not defined')

  if (!symbol || !name) {
    return
  }

  return {
    assetId: assetId,
    address: address?.toString(),
    iconUrl,
    name,
    symbol,
    chain: chainConverter.toName(token.chainId),
    source,
    usdValue,
  }
}
