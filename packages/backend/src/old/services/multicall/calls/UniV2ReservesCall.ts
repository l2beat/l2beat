import { BigNumber, constants, utils } from 'ethers'
import memoizee from 'memoizee'

import { MulticallResponse } from '../MulticallApi'
import { MulticallRequest } from '../MulticallRequest'

const coder = new utils.Interface([
  'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32)',
])

export const UniV2ReservesCall = {
  encode(pair: string): MulticallRequest {
    return {
      address: pair,
      data: coder.encodeFunctionData('getReserves'),
    }
  },
  decode(result: MulticallResponse | undefined) {
    if (!result?.success) {
      return
    }
    const decoded = coder.decodeFunctionResult('getReserves', result.data)
    return [decoded[0], decoded[1]] as [BigNumber, BigNumber]
  },
  decodeOrZero(result: MulticallResponse | undefined) {
    return this.decode(result) ?? [constants.Zero, constants.Zero]
  },
}

UniV2ReservesCall.encode = memoizee(UniV2ReservesCall.encode)
