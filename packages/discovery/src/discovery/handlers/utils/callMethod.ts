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
  filter?: (string | number)[],
) {
  const abi = new utils.Interface([fragment])

  try {
    const callData = Bytes.fromHex(abi.encodeFunctionData(fragment, parameters))
    const result = await provider.call(address, callData, blockNumber)

    return {
      value: decodeMethodResult(abi, fragment, result, filter),
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
  filter?: (string | number)[],
) {
  const decoded = abi.decodeFunctionResult(fragment, result.toString())
  const filtered = filter
    ? filter.map((i) => decoded[i] as utils.Result)
    : decoded
  const mapped = filtered.map(toContractValue)
  return mapped.length === 1 ? mapped[0] : mapped
}
