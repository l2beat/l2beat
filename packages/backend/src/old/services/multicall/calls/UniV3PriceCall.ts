import { BigNumber, constants, utils } from 'ethers'
import memoizee from 'memoizee'

import { MulticallRequest, MulticallResponse } from '../MulticallApi'

const coder = new utils.Interface([
  'function slot0() view returns (uint160 sqrtPriceX96, int24, uint16, uint16, uint16, uint8, bool)',
])

export const UniV3PriceCall = {
  encode(pool: string): MulticallRequest {
    return {
      address: pool,
      data: coder.encodeFunctionData('slot0'),
    }
  },
  decode(result: MulticallResponse | undefined) {
    if (!result?.success) {
      return
    }
    const decoded = coder.decodeFunctionResult('slot0', result.data)
    return decoded[0] as BigNumber
  },
  decodeOrZero(result: MulticallResponse | undefined) {
    return this.decode(result) ?? constants.Zero
  },
}

UniV3PriceCall.encode = memoizee(UniV3PriceCall.encode)
