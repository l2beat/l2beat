import { constants, utils } from 'ethers'
import memoizee from 'memoizee'
import { UNISWAP_V1_FACTORY } from '../../../constants'
import { MulticallRequest, MulticallResponse } from '../MulticallApi'

const coder = new utils.Interface([
  'function getExchange(address token) view returns (address)',
])

export const UniV1ExchangeCall = {
  encode(token: string): MulticallRequest {
    return {
      address: UNISWAP_V1_FACTORY,
      data: coder.encodeFunctionData('getExchange', [token]),
    }
  },
  decode(result: MulticallResponse | undefined) {
    if (!result?.success) {
      return
    }
    const decoded = coder.decodeFunctionResult('getExchange', result.data)
    return decoded[0] as string
  },
  decodeOrZero(result: MulticallResponse | undefined) {
    return this.decode(result) ?? constants.AddressZero
  },
}

UniV1ExchangeCall.encode = memoizee(UniV1ExchangeCall.encode)
