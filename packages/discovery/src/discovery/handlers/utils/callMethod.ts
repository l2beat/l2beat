import { utils } from 'ethers'

import { Bytes } from '../../../utils/Bytes'
import { EthereumAddress } from '../../../utils/EthereumAddress'
import { getErrorMessage } from '../../../utils/getErrorMessage'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { isRevert } from '../../utils/isRevert'
import { toContractValue } from './toContractValue'

export const EXEC_REVERT_MSG = 'Execution reverted'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function callMethod(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  fragment: utils.FunctionFragment,
  parameters: unknown[],
  blockNumber: number,
  pickFields?: (string | number)[],
) {
  const abi = new utils.Interface([fragment])

  try {
    const callData = Bytes.fromHex(abi.encodeFunctionData(fragment, parameters))
    const result = await provider.call(address, callData, blockNumber)

    return {
      value: decodeMethodResult(abi, fragment, result, pickFields),
    }
  } catch (e) {
    return {
      error: isRevert(e) ? EXEC_REVERT_MSG : getErrorMessage(e),
    }
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function decodeMethodResult(
  abi: utils.Interface,
  fragment: utils.FunctionFragment,
  result: Bytes,
  pickFields?: (string | number)[],
) {
  let decoded = abi.decodeFunctionResult(fragment, result.toString())

  if (decoded.length === 1 && Array.isArray(decoded[0])) {
    decoded = decoded[0]
  }

  if (decoded.length === 1 && pickFields !== undefined) {
    throw new Error('Cannot pick fields from a non-struct-like return value')
  }

  const filtered = pickFields
    ? pickFields.map((i) => decoded[i] as utils.Result)
    : decoded
  const mapped = filtered.map(toContractValue)
  return mapped.length === 1 ? mapped[0] : mapped
}
