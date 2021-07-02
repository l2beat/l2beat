import { BigNumber, constants, utils } from 'ethers'
import memoizee from 'memoizee'
import { MULTICALL } from '../../../constants'
import { MulticallRequest, MulticallResponse } from '../MulticallApi'

const coder = new utils.Interface([
  'function getEthBalance(address account) view returns (uint256)',
])

export const EthBalanceCall = {
  encode(holder: string): MulticallRequest {
    return {
      address: MULTICALL,
      data: coder.encodeFunctionData('getEthBalance', [holder]),
    }
  },
  decode(result: MulticallResponse | undefined) {
    if (!result?.success) {
      return
    }
    const decoded = coder.decodeFunctionResult('getEthBalance', result.data)
    return decoded[0] as BigNumber
  },
  decodeOrZero(result: MulticallResponse | undefined) {
    return this.decode(result) ?? constants.Zero
  },
}

EthBalanceCall.encode = memoizee(EthBalanceCall.encode)
