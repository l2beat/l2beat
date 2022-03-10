import { AssetId, Bytes, EthereumAddress } from '@l2beat/common'
import { getTokenByAssetId } from '@l2beat/config'
import { BigNumber, utils } from 'ethers'

import { MULTICALL } from '../../../core/constants'
import { MulticallRequest, MulticallResponse } from '../MulticallClient'

const coder = new utils.Interface([
  'function getEthBalance(address account) view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
])

export interface BalanceCallData {
  holder: EthereumAddress
  asset: AssetId
  request: MulticallRequest
}

export const BalanceCall = {
  generate(holder: EthereumAddress, asset: AssetId): BalanceCallData {
    //TODO discuss ether constant
    if (asset === AssetId('eth-ether')) {
      return {
        holder: holder,
        asset: asset,
        request: {
          address: MULTICALL,
          data: Bytes.fromHex(
            coder.encodeFunctionData('getEthBalance', [holder.toString()])
          ),
        },
      }
    } else {
      return {
        holder: holder,
        asset: asset,
        request: {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          address: getTokenByAssetId(asset).address!,
          data: Bytes.fromHex(
            coder.encodeFunctionData('balanceOf', [holder.toString()])
          ),
        },
      }
    }
  },
  decode(response: MulticallResponse) {
    if (!response?.success) {
      return
    }
    const decoded = coder.decodeFunctionResult(
      'balanceOf',
      response.data.toString()
    )
    return (decoded[0] as BigNumber).toBigInt()
  },
}
