import { getEnv } from '@l2beat/backend-tools'
import { CoingeckoClient, HttpClient } from '@l2beat/shared'
import {
  assert,
  CoingeckoId,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import chalk from 'chalk'
import { providers, utils } from 'ethers'

import { ethereum } from '../chains/ethereum'

export async function getTokenInfo(
  _symbol: string,
  platform: string | undefined,
  address: EthereumAddress | undefined,
  devId: string,
  _coingeckoId: CoingeckoId | undefined,
) {
  console.log(chalk.yellow('Loading... ') + 'environment variables')
  const env = getEnv()
  const coingeckoApiKey = env.optionalString('COINGECKO_API_KEY')
  const http = new HttpClient()
  const coingeckoClient = new CoingeckoClient(http, coingeckoApiKey)
  console.log(chalk.green('Loaded ') + 'environment variables\n')

  const coingeckoId =
    _coingeckoId ??
    (await getCoingeckoId(_symbol, coingeckoClient, address, platform))

  // TODO: this should be automatically loaded using new dynamic envs
  const rpcUrl = env.optionalString(`${devId.toUpperCase()}_RPC_URL`)
  if (!rpcUrl) {
    console.log(
      chalk.red('Missing environmental variable ') +
        `${devId.toUpperCase()}_RPC_URL\n`,
    )
    process.exit(1)
  }
  const provider = new providers.JsonRpcProvider(rpcUrl)

  const [name, symbol, decimals, iconUrl, sinceTimestamp] = await Promise.all([
    getName(provider, address),
    getSymbol(provider, address),
    getDecimals(provider, address),
    coingeckoClient.getImageUrl(coingeckoId),
    getSinceTimestamp(provider, coingeckoClient, address, coingeckoId),
  ])

  if (symbol !== _symbol) {
    console.log(
      chalk.red('Misconfiguration') +
        ` symbol mismatch  ${symbol} !== ${_symbol}`,
    )
  }

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
  'function aggregate(tuple(address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
]
const CODER = new utils.Interface(ABI)

async function getName(
  provider: providers.JsonRpcProvider,
  address: EthereumAddress,
) {
  const nameResult = await provider.call({
    to: address.toString(),
    data: '0x06fdde03', // name()
  })
  if (nameResult === '0x') {
    throw new Error('Could not find name for token')
  }
  const name = CODER.decodeFunctionResult('name', nameResult)[0] as string
  return name
}

async function getSymbol(
  provider: providers.JsonRpcProvider,
  address: EthereumAddress,
) {
  const symbolResult = await provider.call({
    to: address.toString(),
    data: '0x95d89b41', // symbol()
  })
  if (symbolResult === '0x') {
    throw new Error('Could not find symbol for token')
  }
  const symbol = CODER.decodeFunctionResult('symbol', symbolResult)[0] as string
  return symbol
}

async function getDecimals(
  provider: providers.JsonRpcProvider,
  address: EthereumAddress,
) {
  const decimalsResult = await provider.call({
    to: address.toString(),
    data: '0x313ce567', // decimals()
  })
  if (decimalsResult === '0x') {
    throw new Error('Could not find decimals for token')
  }
  return parseInt(
    CODER.decodeFunctionResult('decimals', decimalsResult)[0] as string,
  )
}

async function getCoingeckoId(
  symbol: string,
  coingeckoClient: CoingeckoClient,
  address: EthereumAddress,
  platform: string | undefined,
) {
  if (!platform) {
    console.log(
      chalk.red('Error ') +
        'could not find coingecko platform identifier for token ' +
        symbol +
        '. Please add it chain config of the project\n',
    )
    process.exit(1)
  }

  const coinList = await coingeckoClient.getCoinList({
    includePlatform: true,
  })

  const coin = coinList.find((coin) => {
    return (
      coin.platforms[platform]?.toLowerCase() ===
      address.toString().toLowerCase()
    )
  })

  if (!coin?.id) {
    console.log(
      chalk.red('Error ') +
        'could not find coingeckoId for token ' +
        symbol +
        '. Please add it manually to source.jsonc\n',
    )
    process.exit(1)
  }

  return coin.id
}

async function getSinceTimestamp(
  provider: providers.JsonRpcProvider,
  coingeckoClient: CoingeckoClient,
  address: EthereumAddress,
  coingeckoId: CoingeckoId,
) {
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
  assert(
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

async function getContractCreationTimestamp(
  provider: providers.JsonRpcProvider,
  address: EthereumAddress,
): Promise<UnixTime> {
  const minBlockNumber = 0
  const maxBlockNumber = await provider.getBlockNumber()

  const creationBlock = bisectToFindCreationBlock(
    provider,
    address,
    minBlockNumber,
    maxBlockNumber,
  )

  const block = await provider.getBlock(creationBlock)
  return new UnixTime(block.timestamp)
}

async function bisectToFindCreationBlock(
  provider: providers.JsonRpcProvider,
  address: EthereumAddress,
  minBlockNumber: number,
  maxBlockNumber: number,
): Promise<number> {
  if (minBlockNumber === maxBlockNumber) {
    return minBlockNumber
  }

  const midBlockNumber = Math.floor((minBlockNumber + maxBlockNumber) / 2)

  const code = await provider.getCode(address.toString(), midBlockNumber)

  if (code !== '0x') {
    return bisectToFindCreationBlock(
      provider,
      address,
      minBlockNumber,
      midBlockNumber,
    )
  } else {
    return bisectToFindCreationBlock(
      provider,
      address,
      midBlockNumber + 1,
      maxBlockNumber,
    )
  }
}
