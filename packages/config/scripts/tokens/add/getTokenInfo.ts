import { CoingeckoClient, HttpClient } from '@l2beat/shared'
import { AssetId, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { providers, utils } from 'ethers'
import { z } from 'zod'

import { TokenInfo } from '../../../src/tokens/types'
import { getEnv } from '../../checkVerifiedContracts/utils'

export async function getTokenInfo(
  provider: providers.JsonRpcProvider,
  address: EthereumAddress,
  category: z.infer<typeof TokenInfo.shape.category>,
): Promise<TokenInfo> {
  const [name, coingeckoId, symbol, decimals, sinceTimestamp] =
    await Promise.all([
      getName(provider, address),
      getCoingeckoId(address),
      getSymbol(provider, address),
      getDecimals(provider, address),
      getSinceTimestamp(provider, address),
    ])

  const tokenInfo: TokenInfo = {
    id: AssetId(`${symbol.toLowerCase()}-${name.toLowerCase()}`),
    name,
    coingeckoId,
    address,
    symbol,
    decimals,
    sinceTimestamp,
    category,
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
  return CODER.decodeFunctionResult('name', nameResult)[0] as string
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
  return CODER.decodeFunctionResult('symbol', symbolResult)[0] as string
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

async function getCoingeckoId(address: EthereumAddress) {
  const http = new HttpClient()
  const coingeckoClient = new CoingeckoClient(http, undefined)

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
) {
  const http = new HttpClient()
  const response = await http.fetch(
    `https://api.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=
      ${address.toString()}&apikey=${getEnv('ETHERSCAN_API_KEY')}`,
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
