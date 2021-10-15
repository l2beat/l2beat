import { utils } from 'ethers'
import memoizee from 'memoizee'

import { Bytes, EthereumAddress } from '../../../model'
import {
  MULTICALL_V1_ADDRESS,
  MulticallRequest,
  MulticallResponse,
} from '../../ethereum/MulticallClient'

const coder = new utils.Interface([
  'function balanceOf(address account) returns (uint256)',
  'function getEthBalance(address account) returns (uint256)',
])

const TEN_TO_18 = 10n ** 18n

export function encodeUniswapV1Requests(
  token: EthereumAddress,
  exchanges: Map<EthereumAddress, EthereumAddress>
): MulticallRequest[] {
  const exchange = exchanges.get(token)
  if (!exchange) {
    return []
  }
  return [
    { address: MULTICALL_V1_ADDRESS, data: encodeGetEthBalance(exchange) },
    { address: token, data: encodeBalanceOf(exchange) },
  ]
}

export function decodeUniswapV1Results(results: MulticallResponse[]) {
  if (results.length === 0 || results.some((x) => !x.success)) {
    return { liquidity: 0n, price: 0n }
  }
  const ethBalance = decodeGetEthBalance(results[0].data)
  const tokenBalance = decodeBalanceOf(results[1].data)
  const price =
    tokenBalance !== 0n ? (TEN_TO_18 * ethBalance) / tokenBalance : 0n
  return { liquidity: tokenBalance, price }
}

export const encodeBalanceOf = memoizee(
  (account: EthereumAddress) => {
    return Bytes.fromHex(
      coder.encodeFunctionData('balanceOf', [account.toString()])
    )
  },
  { primitive: true }
)

export function decodeBalanceOf(data: Bytes) {
  const decoded = coder.decodeFunctionResult('balanceOf', data.toString())
  return BigInt(decoded[0])
}

export const encodeGetEthBalance = memoizee(
  (account: EthereumAddress) => {
    return Bytes.fromHex(
      coder.encodeFunctionData('getEthBalance', [account.toString()])
    )
  },
  { primitive: true }
)

export function decodeGetEthBalance(data: Bytes) {
  const decoded = coder.decodeFunctionResult('getEthBalance', data.toString())
  return BigInt(decoded[0])
}
