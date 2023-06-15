import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { isRevert } from './isRevert'

export async function getCallResult<T>(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  methodAbi: string,
  values: unknown[],
  blockNumber: number,
) {
  try {
    return await getCallResultWithRevert<T>(
      provider,
      address,
      methodAbi,
      values,
      blockNumber,
    )
  } catch (e) {
    if (isRevert(e)) {
      return undefined
    }
    throw e
  }
}

export async function getCallResultWithRevert<T>(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  methodAbi: string,
  values: unknown[],
  blockNumber: number,
) {
  const abi = new utils.Interface([methodAbi])
  const fragment = Object.values(abi.functions)[0]
  const callData = Bytes.fromHex(abi.encodeFunctionData(fragment, values))
  const result = await provider.call(address, callData, blockNumber)
  return abi.decodeFunctionResult(fragment, result.toString())[0] as T
}
