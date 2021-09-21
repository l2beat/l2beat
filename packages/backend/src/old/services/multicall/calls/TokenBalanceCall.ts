import { BigNumber, constants, utils } from 'ethers'
import memoizee from 'memoizee'

import { MulticallRequest, MulticallResponse } from '../MulticallApi'

const coder = new utils.Interface([
  'function balanceOf(address account) view returns (uint256)',
])

export const TokenBalanceCall = {
  encode(token: string, holder: string): MulticallRequest {
    return {
      address: token,
      data: coder.encodeFunctionData('balanceOf', [holder]),
    }
  },
  decode(result: MulticallResponse | undefined) {
    if (!result?.success) {
      return
    }
    const decoded = coder.decodeFunctionResult('balanceOf', result.data)
    return decoded[0] as BigNumber
  },
  decodeOrZero(result: MulticallResponse | undefined) {
    return this.decode(result) ?? constants.Zero
  },
}

TokenBalanceCall.encode = memoizee(TokenBalanceCall.encode)
