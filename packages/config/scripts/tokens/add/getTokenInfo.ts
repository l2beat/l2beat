import { CoingeckoClient, HttpClient } from '@l2beat/shared'
import {
  AssetId,
  ChainId,
  EthereumAddress,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'
import { providers, utils } from 'ethers'

export async function getTokenInfo(
  provider: providers.JsonRpcProvider,
  coingeckoClient: CoingeckoClient,
  address: EthereumAddress,
  category: 'ether' | 'stablecoin' | 'other',
  etherscanApiKey: string,
): Promise<Token> {
  const coingeckoId = await getCoingeckoId(coingeckoClient, address)

  const [name, symbol, decimals, iconUrl, sinceTimestamp] = await Promise.all([
    getName(provider, address),
    getSymbol(provider, address),
    getDecimals(provider, address),
    coingeckoClient.getImageUrl(coingeckoId),
    getSinceTimestamp(provider, address, etherscanApiKey),
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
    // TODO: make it configurable
    chainId: ChainId.ETHEREUM,
    iconUrl,
    type: 'CBV',
    formula: 'locked',
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
  address: EthereumAddress,
  etherscanApiKey: string,
) {
  const http = new HttpClient()
  const response = await http.fetch(
    `https://api.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=
      ${address.toString()}&apikey=${etherscanApiKey}`,
  )
  const data = (await response.json()) as unknown as {
    result: { txHash: string }[]
  }

  if (data.result.length === 0) {
    throw new Error('Could not find transaction hash for token')
  }

  const txHash = data.result[0].txHash

  const tx = await provider.getTransaction(txHash)

  if (!tx.blockNumber) {
    throw new Error('Could not find block number for token')
  }

  const block = await provider.getBlock(tx.blockNumber)

  return new UnixTime(block.timestamp)
}
