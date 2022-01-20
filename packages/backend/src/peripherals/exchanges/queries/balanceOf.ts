import { Bytes, EthereumAddress } from '@l2beat/common'
import { utils } from 'ethers'
import memoizee from 'memoizee'

export const coder = new utils.Interface([
  'function balanceOf(address account) returns (uint256)',
])

export const encodeBalanceOf = memoizee((account: EthereumAddress) => {
  return Bytes.fromHex(
    coder.encodeFunctionData('balanceOf', [account.toString()])
  )
})

export function decodeBalanceOf(data: Bytes) {
  const decoded = coder.decodeFunctionResult('balanceOf', data.toString())
  return BigInt(decoded[0])
}
