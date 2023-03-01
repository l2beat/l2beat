import {
  AssetId,
  CoingeckoClient,
  EthereumAddress,
  HttpClient,
  UnixTime,
} from '@l2beat/shared'
import { providers, utils } from 'ethers'

import { TokenInfo } from '../../src/tokens/types'
import { getEnv } from '../checkVerifiedContracts/utils'

const ABI = [
  'function aggregate(tuple(address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
]
const CODER = new utils.Interface(ABI)

export async function getTokenInfo(
  provider: providers.JsonRpcProvider,
  address: EthereumAddress,
  category: 'ether' | 'stablecoin' | 'other',
): Promise<TokenInfo[]> {
  const nameResult = await provider.call({
    to: address.toString(),
    data: '0x06fdde03', // name()
  })
  if (nameResult === '0x') {
    throw new Error('Could not find name for token')
  }
  const name = CODER.decodeFunctionResult('name', nameResult)[0] as string

  const symbolResult = await provider.call({
    to: address.toString(),
    data: '0x95d89b41', // symbol()
  })
  if (symbolResult === '0x') {
    throw new Error('Could not find symbol for token')
  }
  const symbol = CODER.decodeFunctionResult('symbol', symbolResult)[0] as string

  const decimalsResult = await provider.call({
    to: address.toString(),
    data: '0x313ce567', // decimals()
  })
  if (decimalsResult === '0x') {
    throw new Error('Could not find decimals for token')
  }
  const decimals = parseInt(
    CODER.decodeFunctionResult('decimals', decimalsResult)[0] as string,
  )

  const http = new HttpClient()
  const coingeckoClient = new CoingeckoClient(http, undefined)

  const coinList = await coingeckoClient.getCoinList({
    includePlatform: true,
  })

  const coin = coinList.find((coin) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (coin.platforms.ethereum === undefined) {
      return false
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return EthereumAddress(coin.platforms.ethereum!) === address
  })

  if (coin === undefined || coin.id === undefined) {
    throw new Error('Could not find coingeckoId for token')
  }

  const response = await http.fetch(
    `https://api.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=
      ${address.toString()}&apikey=${getEnv('ETHERSCAN_API_KEY')}`,
  )

  const data = (await response.json()) as unknown as {
    result: { txHash: string }[]
  }

  const txHash = data.result[0].txHash

  const tx = await provider.getTransaction(txHash)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const blockNumber = tx.blockNumber!

  const block = await provider.getBlock(blockNumber)

  const sinceTimestamp = new UnixTime(block.timestamp)

  const tokenInfo: TokenInfo = {
    id: AssetId(`${symbol.toLowerCase()}-${name.toLowerCase()}`),
    name,
    coingeckoId: coin.id,
    address,
    symbol,
    decimals,
    sinceTimestamp,
    category,
  }

  console.log(tokenInfo)
  return []
}
