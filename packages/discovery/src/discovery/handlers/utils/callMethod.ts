import type { EthereumAddress } from '@l2beat/shared-pure'
import type { utils } from 'ethers'

import { getErrorMessage } from '../../../utils/getErrorMessage'
import type { IProvider } from '../../provider/IProvider'
import { isIntNumeric } from '../../utils/normalizeDiffPath'
import { toContractValue } from './toContractValue'

export const EXEC_REVERT_MSG = 'Execution reverted'

export async function callMethod(
  provider: IProvider,
  address: EthereumAddress,
  fragment: utils.FunctionFragment,
  parameters: unknown[],
  pickFields?: string[],
) {
  try {
    const result = await provider.callMethod(address, fragment, parameters)
    if (result === undefined) {
      return { error: EXEC_REVERT_MSG }
    }
    return { value: applyPickFields(result as utils.Result, pickFields) }
  } catch (e) {
    return {
      error: getErrorMessage(e),
    }
  }
}

function applyPickFields(result: utils.Result, pickFields?: string[]) {
  if (pickFields) {
    if (!Array.isArray(result)) {
      throw new Error('Cannot pick fields from a non-struct-like return value')
    }
    const picked = pickFields.map((p) => pickAField(result, p))
    return toContractValue(picked)
  }
  return toContractValue(result)
}

function pickAField(decoded: utils.Result, fieldPath: string): utils.Result {
  const parts = fieldPath.split('.')
  let current = decoded
  for (const part of parts) {
    const index = isIntNumeric(part) ? parseInt(part) : part
    current = current[index]
  }
  return current as utils.Result
}
