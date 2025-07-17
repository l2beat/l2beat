import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { utils } from 'ethers'

import { getErrorMessage } from '../../../utils/getErrorMessage'
import type { IProvider } from '../../provider/IProvider'
import { toContractValue } from './toContractValue'

export const EXEC_REVERT_MSG = 'Execution reverted'

export async function callMethod(
  provider: IProvider,
  address: ChainSpecificAddress,
  fragment: utils.FunctionFragment,
  parameters: unknown[],
) {
  try {
    const result = await provider.callMethod(address, fragment, parameters)
    if (result === undefined) {
      return { error: EXEC_REVERT_MSG }
    }
    return { value: toContractValue(result) }
  } catch (e) {
    return {
      error: getErrorMessage(e),
    }
  }
}
