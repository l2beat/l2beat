import { CoingeckoClient, CoingeckoQueryService } from '@l2beat/shared'
import {
  assert,
  AssetId,
  AssetType,
  ChainId,
  CoingeckoId,
  EthereumAddress,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'
import { providers, utils } from 'ethers'

export async function getTokenInfo(
  provider: providers.JsonRpcProvider,
  coingeckoClient: CoingeckoClient,
  address: EthereumAddress | undefined,
  chainId: ChainId,
  type: AssetType,
  formula: 'totalSupply' | 'locked' | 'circulatingSupply',
  category: 'ether' | 'stablecoin' | 'other',
): Promise<Token> {
  if (!address) {
    throw new Error('Native asset detected, configure manually')
  }

  const coingeckoId = await getCoingeckoId(coingeckoClient, address)

  const [name, symbol, decimals, iconUrl, sinceTimestamp] = await Promise.all([
    getName(provider, address),
    getSymbol(provider, address),
    getDecimals(provider, address),
    coingeckoClient.getImageUrl(coingeckoId),
    getSinceTimestamp(provider, coingeckoClient, address, coingeckoId),
  ])

  const tokenInfo: Token = {
    id: AssetId(`${symbol.toLowerCase()}-${name.toLowerCase()}`),
    name,
    coingeckoId,
    address,
    symbol,
    decimals,
    sinceTimestamp,
    category,
    chainId,
    iconUrl,
    type,
    formula,
  }

  return tokenInfo
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
  return name.replaceAll(' ', '-')
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
  return symbol.replaceAll(' ', '-')
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
  coingeckoClient: CoingeckoClient,
  address: EthereumAddress,
) {
  const coinList = await coingeckoClient.getCoinList({
    includePlatform: true,
  })

  const coin = coinList.find((coin) => {
    return (
      coin.platforms.ethereum?.toLowerCase() ===
      address.toString().toLowerCase()
    )
  })

  if (!coin?.id) {
    throw new Error('Could not find coingeckoId for token')
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
      new UnixTime(0),
      UnixTime.now(),
    )
  assert(
    coingeckoPriceHistoryData.prices.length >= 1,
    `No price history found for token: ${coingeckoId.toString()}`,
  )
  const firstCoingeckoPriceTimestamp = new UnixTime(
    coingeckoPriceHistoryData.prices[0].date.getTime() / 1000,
  )
  //We call it to check if there is a gap in price history
  const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
  await coingeckoQueryService.getUsdPriceHistory(
    coingeckoId,
    firstCoingeckoPriceTimestamp,
    UnixTime.now(),
  )
  // If code reaches here, then the price data is okay

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
