import { CoingeckoClient } from '@l2beat/shared'
import { CoingeckoId, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { providers, utils } from 'ethers'

import { ethereum } from '../../../src/chains/ethereum'
import { getContractCreationTimestamp } from './getContractCreationTimestamp'
import { ScriptLogger } from './ScriptLogger'

export async function getTokenInfo(
  logger: ScriptLogger,
  provider: providers.JsonRpcProvider,
  coingeckoClient: CoingeckoClient,
  address: EthereumAddress,
  symbolFromConfig: string,
  coingeckoId: CoingeckoId,
) {
  const [name, symbol, decimals, iconUrl, sinceTimestamp] = await Promise.all([
    getName(provider, logger, address),
    getSymbol(provider, logger, address),
    getDecimals(provider, logger, address),
    getImageUrl(coingeckoClient, logger, coingeckoId),
    getSinceTimestamp(provider, logger, coingeckoClient, address, coingeckoId),
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
    sinceTimestamp,
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

  return parseInt(CODER.decodeFunctionResult('decimals', decimals)[0] as string)
}

function getImageUrl(
  coingeckoClient: CoingeckoClient,
  logger: ScriptLogger,
  coingeckoId: CoingeckoId,
): Promise<string> {
  logger.fetching('image url')

  return coingeckoClient.getImageUrl(coingeckoId)
}

async function getSinceTimestamp(
  provider: providers.JsonRpcProvider,
  logger: ScriptLogger,
  coingeckoClient: CoingeckoClient,
  address: EthereumAddress,
  coingeckoId: CoingeckoId,
) {
  logger.fetching('sinceTimestamp (this will take a while)')

  const contractCreationTimestamp = await getContractCreationTimestamp(
    provider,
    address,
  )

  const coingeckoPriceHistoryData =
    await coingeckoClient.getCoinMarketChartRange(
      coingeckoId,
      'usd',
      ethereum.minTimestampForTvl ?? new UnixTime(0),
      UnixTime.now(),
    )

  logger.assert(
    coingeckoPriceHistoryData.prices.length >= 1,
    `No price history found for token: ${coingeckoId.toString()}`,
  )

  const firstCoingeckoPriceTimestamp = new UnixTime(
    coingeckoPriceHistoryData.prices[0].date.getTime() / 1000,
  )

  const timestamp = Math.max(
    contractCreationTimestamp.toNumber(),
    firstCoingeckoPriceTimestamp.toNumber(),
  )
  return new UnixTime(timestamp)
}
