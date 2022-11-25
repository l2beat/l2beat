import { Contract, providers, utils } from 'ethers'

import { isRevert } from './isRevert'

export async function getCallResult<T>(
  provider: providers.Provider,
  contract: Contract | string,
  methodAbi: string,
) {
  try {
    return await getCallResultWithRevert<T>(provider, contract, methodAbi)
  } catch (e) {
    if (isRevert(e)) {
      return undefined
    }
    throw e
  }
}

export async function getCallResultWithRevert<T>(
  provider: providers.Provider,
  contract: Contract | string,
  methodAbi: string,
) {
  const address = typeof contract === 'string' ? contract : contract.address
  const abi = new utils.Interface([methodAbi])
  const fragment = Object.values(abi.functions)[0]
  const callData = abi.encodeFunctionData(fragment)
  const result = await provider.call({ to: address, data: callData })
  return abi.decodeFunctionResult(fragment, result)[0] as T
}
