import type { CoingeckoClient } from '@l2beat/shared'
import {
  assert,
  type CoingeckoId,
  type EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { type providers, utils } from 'ethers'
import { MIN_TIMESTAMP_FOR_TVL } from '../../projects/ethereum/ethereum'
import { getContractCreationTimestamp } from './getContractCreationTimestamp'
import type { ScriptLogger } from './ScriptLogger'

export async function getTokenInfo(
  logger: ScriptLogger,
  provider: providers.JsonRpcProvider,
  coingeckoClient: CoingeckoClient,
  address: EthereumAddress,
  symbolFromConfig: string,
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
    getName(provider, logger, address),
    getSymbol(provider, logger, address),
    getDecimals(provider, logger, address),
    getImageUrl(coingeckoClient, logger, coingeckoId),
    getDeploymentTimestamp(
      logger,
      provider,
      address,
      deploymentTimestampOverride,
    ),
    getCoingeckoListingTimestamp(logger, coingeckoClient, coingeckoId),
  ])

  logger.assert(
    symbolFromConfig === symbolFromConfig,
    ` symbol mismatch  ${symbolFromConfig} !== ${symbolFromConfig}`,
  )

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

async function getName(
  provider: providers.JsonRpcProvider,
  logger: ScriptLogger,
  address: EthereumAddress,
) {
  logger.fetching('name')

  const name = await provider.call({
    to: address.toString(),
    data: '0x06fdde03', // name()
  })

  logger.assert(name !== '0x', 'Could not find name for token')

  return CODER.decodeFunctionResult('name', name)[0] as string
}

async function getSymbol(
  provider: providers.JsonRpcProvider,
  logger: ScriptLogger,
  address: EthereumAddress,
) {
  logger.fetching('symbol')

  const symbol = await provider.call({
    to: address.toString(),
    data: '0x95d89b41', // symbol()
  })

  logger.assert(symbol !== '0x', 'Could not find symbol for token')

  return CODER.decodeFunctionResult('symbol', symbol)[0] as string
}

async function getDecimals(
  provider: providers.JsonRpcProvider,
  logger: ScriptLogger,
  address: EthereumAddress,
) {
  logger.fetching('decimals')

  const decimals = await provider.call({
    to: address.toString(),
    data: '0x313ce567', // decimals()
  })

  logger.assert(decimals !== '0x', 'Could not find decimals for token')

  return Number.parseInt(
    CODER.decodeFunctionResult('decimals', decimals)[0] as string,
  )
}

function getImageUrl(
  coingeckoClient: CoingeckoClient,
  logger: ScriptLogger,
  coingeckoId: CoingeckoId,
): Promise<string> {
  logger.fetching('image url')

  return coingeckoClient.getImageUrl(coingeckoId)
}

async function getDeploymentTimestamp(
  logger: ScriptLogger,
  provider: providers.JsonRpcProvider,
  address: EthereumAddress,
  override?: UnixTime,
) {
  if (override) {
    return override
  }

  logger.fetching('sinceTimestamp (this will take a while)')

  const contractCreationTimestamp = await getContractCreationTimestamp(
    provider,
    address,
  )

  assert(
    contractCreationTimestamp > MIN_TIMESTAMP_FOR_TVL,
    'Deployment timestamp looks odd, provide manual override in tokens.jsonc',
  )

  return contractCreationTimestamp
}

async function getCoingeckoListingTimestamp(
  logger: ScriptLogger,
  coingeckoClient: CoingeckoClient,
  coingeckoId: CoingeckoId,
) {
  logger.fetching('coingeckoListingTimestamp')

  const coingeckoPriceHistoryData =
    await coingeckoClient.getCoinMarketChartRange(
      coingeckoId,
      'usd',
      MIN_TIMESTAMP_FOR_TVL,
      UnixTime.now(),
    )

  logger.assert(
    coingeckoPriceHistoryData.prices.length >= 1,
    `No price history found for token: ${coingeckoId.toString()}`,
  )

  const firstCoingeckoPriceTimestamp = UnixTime(
    Math.floor(coingeckoPriceHistoryData.prices[0].date.getTime() / 1000),
  )

  return firstCoingeckoPriceTimestamp
}
