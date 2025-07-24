import {
  assert,
  type ChainSpecificAddress,
  type CoingeckoId,
  UnixTime,
} from '@l2beat/shared-pure'
import type { IProvider } from '../../../provider/IProvider'
import { today } from './utils'

export async function getTokenInfo(
  provider: IProvider,
  address: ChainSpecificAddress,
  coingeckoId: CoingeckoId,
  deploymentTimestampOverride?: UnixTime,
) {
  const [
    name,
    symbol,
    decimals,
    iconUrl,
    deploymentTimestamp,
    coingeckoListingTimestamp,
  ] = await Promise.all([
    getName(provider, address),
    getSymbol(provider, address),
    getDecimals(provider, address),
    getImageUrl(provider, coingeckoId),
    getDeploymentTimestamp(provider, address, deploymentTimestampOverride),
    getCoingeckoListingTimestamp(provider, coingeckoId),
  ])

  return {
    name,
    symbol,
    decimals,
    iconUrl,
    deploymentTimestamp,
    coingeckoListingTimestamp,
    coingeckoId,
  }
}

async function getName(provider: IProvider, address: ChainSpecificAddress) {
  const name = await provider.callMethod<string>(
    address,
    'function name() view returns (string)',
    [],
  )

  return name
}

async function getSymbol(provider: IProvider, address: ChainSpecificAddress) {
  const symbol = await provider.callMethod<string>(
    address,
    'function symbol() view returns (string)',
    [],
  )

  return symbol
}

async function getDecimals(provider: IProvider, address: ChainSpecificAddress) {
  const decimals = await provider.callMethod<number>(
    address,
    'function decimals() view returns (uint8)',
    [],
  )

  return decimals
}

function getImageUrl(
  provider: IProvider,
  coingeckoId: CoingeckoId,
): Promise<string> {
  return provider.raw(
    `coingecko-image-${coingeckoId.toString()}-${today()}`,
    (raw) => raw.coingeckoClient.getImageUrl(coingeckoId),
  )
}

async function getDeploymentTimestamp(
  provider: IProvider,
  address: ChainSpecificAddress,
  override?: UnixTime,
) {
  if (override) {
    return override
  }

  const contractCreationTimestamp = await provider.getDeployment(address)

  return contractCreationTimestamp?.timestamp
}

const FIRST_L2_DEPLOYMENT_TIMESTAMP = UnixTime.fromDate(
  new Date('2019-11-14T00:00:00Z'),
)

async function getCoingeckoListingTimestamp(
  provider: IProvider,
  coingeckoId: CoingeckoId,
) {
  const coingeckoPriceHistoryData = await provider.raw(
    `coingecko-price-history-${coingeckoId.toString()}-${today()}`,
    (raw) =>
      raw.coingeckoClient.getCoinMarketChartRange(
        coingeckoId,
        'usd',
        FIRST_L2_DEPLOYMENT_TIMESTAMP,
        UnixTime.now(),
      ),
  )

  assert(
    coingeckoPriceHistoryData.prices.length >= 1,
    `No price history found for token: ${coingeckoId.toString()}`,
  )

  const [firstPrice] = coingeckoPriceHistoryData.prices

  assert(
    firstPrice,
    `No price history found for token: ${coingeckoId.toString()}`,
  )

  const firstCoingeckoPriceTimestamp = UnixTime(
    Math.floor(new Date(firstPrice.date).getTime() / 1000),
  )

  return firstCoingeckoPriceTimestamp
}
