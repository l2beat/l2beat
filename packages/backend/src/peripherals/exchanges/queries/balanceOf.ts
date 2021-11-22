import { utils } from 'ethers'
import memoizee from 'memoizee'

import { Bytes, EthereumAddress } from '../../../model'

export const coder = new utils.Interface([
  'function balanceOf(address account) returns (uint256)',
])

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
