import { Bytes, EthereumAddress, getErrorMessage } from '@l2beat/shared'
import { utils } from 'ethers'

import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { isRevert } from '../../utils/isRevert'
import { toContractValue } from './toContractValue'

export async function callMethod(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  fragment: utils.FunctionFragment,
  parameters: unknown[],
) {
  const abi = new utils.Interface([fragment])
  try {
    const callData = Bytes.fromHex(abi.encodeFunctionData(fragment, parameters))
    const result = await provider.call(address, callData)
    const decoded = abi.decodeFunctionResult(fragment, result.toString())
    const mapped = decoded.map(toContractValue)
    return {
      value: mapped.length === 1 ? mapped[0] : mapped,
    }
  } catch (e) {
    return {
      error: isRevert(e) ? 'Execution reverted' : getErrorMessage(e),
    }
  }
}
