import {
  assert,
  Bytes,
  type CoingeckoId,
  type EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { IProvider } from '../../../provider/IProvider'

export async function getTokenInfo(
  provider: IProvider,
  address: EthereumAddress,
  // symbolFromConfig: string,
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

  // assert(
  //   symbolFromConfig === symbolFromConfig,
  //   ` symbol mismatch  ${symbolFromConfig} !== ${symbolFromConfig}`,
  // )

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

const ABI = [
  'function aggregate(tuple(address target, bytes callData)[] calls) view returns (uint256 blockNumber, logger, bytes[] returnData)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
]
const CODER = new utils.Interface(ABI)

const ZERO_BYTES = Bytes.fromHex('0x')

async function getName(provider: IProvider, address: EthereumAddress) {
  const data = Bytes.fromHex('0x06fdde03') // name()

  const name = await provider.call(address, data)

  assert(!name.equals(ZERO_BYTES), 'Could not find name for token')

  return CODER.decodeFunctionResult('name', name.toString())[0] as string
}

async function getSymbol(provider: IProvider, address: EthereumAddress) {
  const data = Bytes.fromHex('0x95d89b41') // symbol()

  const symbol = await provider.call(address, data)

  assert(!symbol.equals(ZERO_BYTES), 'Could not find symbol for token')

  return CODER.decodeFunctionResult('symbol', symbol.toString())[0] as string
}

async function getDecimals(provider: IProvider, address: EthereumAddress) {
  const data = Bytes.fromHex('0x313ce567') // decimals()

  const decimals = await provider.call(address, data)

  assert(!decimals.equals(ZERO_BYTES), 'Could not find decimals for token')

  return Number.parseInt(
    CODER.decodeFunctionResult('decimals', decimals.toString())[0] as string,
  )
}

function getImageUrl(
  provider: IProvider,
  coingeckoId: CoingeckoId,
): Promise<string> {
  return provider.raw(`coingecko-image-${coingeckoId.toString()}`, (raw) =>
    raw.coingeckoClient.getImageUrl(coingeckoId),
  )
}

async function getDeploymentTimestamp(
  provider: IProvider,
  address: EthereumAddress,
  override?: UnixTime,
) {
  if (override) {
    return override
  }

  const contractCreationTimestamp = await provider.getDeployment(address)

  return contractCreationTimestamp?.timestamp
}

// Remove it
// Deployment of the first L2
export const MIN_TIMESTAMP_FOR_TVL = UnixTime.fromDate(
  new Date('2019-11-14T00:00:00Z'),
)

async function getCoingeckoListingTimestamp(
  provider: IProvider,
  coingeckoId: CoingeckoId,
) {
  const coingeckoPriceHistoryData = await provider.raw(
    `coingecko-price-history-${coingeckoId.toString()}`,
    (raw) =>
      raw.coingeckoClient.getCoinMarketChartRange(
        coingeckoId,
        'usd',
        MIN_TIMESTAMP_FOR_TVL,
        UnixTime.now(),
      ),
  )

  assert(
    coingeckoPriceHistoryData.prices.length >= 1,
    `No price history found for token: ${coingeckoId.toString()}`,
  )

  const firstCoingeckoPriceTimestamp = UnixTime(
    // biome-ignore lint/style/noNonNullAssertion: check above
    Math.floor(coingeckoPriceHistoryData.prices[0]!.date.getTime() / 1000),
  )

  return firstCoingeckoPriceTimestamp
}
