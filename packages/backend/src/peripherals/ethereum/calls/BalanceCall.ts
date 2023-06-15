import { getTokenByAssetId } from '@l2beat/config'
import { AssetId, Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { BigNumber, utils } from 'ethers'

import {
  MULTICALL_V1_ADDRESS,
  MulticallRequest,
  MulticallResponse,
} from '../MulticallClient'

const coder = new utils.Interface([
  'function getEthBalance(address account) view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
])

export const BalanceCall = {
  encode(holder: EthereumAddress, asset: AssetId): MulticallRequest {
    //TODO discuss ether constant AssetId.ETHER
    if (asset === AssetId.ETH) {
      return {
        address: MULTICALL_V1_ADDRESS,
        data: Bytes.fromHex(
          coder.encodeFunctionData('getEthBalance', [holder.toString()]),
        ),
      }
    } else {
      return {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        address: getTokenByAssetId(asset).address!,
        data: Bytes.fromHex(
          coder.encodeFunctionData('balanceOf', [holder.toString()]),
        ),
      }
    }
  },
  decode(response: MulticallResponse) {
    if (!response.success) {
      return
    }
    const [value] = coder.decodeFunctionResult(
      'balanceOf',
      response.data.toString(),
    )
    return (value as BigNumber).toBigInt()
  },
  decodeOr(response: MulticallResponse, fallback: bigint) {
    return this.decode(response) ?? fallback
  },
}
