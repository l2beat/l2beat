import { utils } from 'ethers'

import type { StructureContractConfig } from '../config/structureUtils'
import type { Handler } from './Handler'
import { LimitedArrayHandler } from './system/LimitedArrayHandler'
import { SimpleMethodHandler } from './system/SimpleMethodHandler'

/** How many indices, from 0, V1 reads of every view function with one `uint256` argument. */
export const PROBED_INDICES = 5

export function getSystemHandlers(
  abiEntries: string[],
  config: StructureContractConfig,
): Handler[] {
  const abi = new utils.Interface(abiEntries)

  const methodHandlers: Handler[] = []
  const arrayHandlers: Handler[] = []

  for (const fn of Object.values(abi.functions)) {
    if (!fn.constant || (fn.outputs?.length ?? 0) === 0) {
      // function is neither pure nor view, or simply doesn't return anything
      continue
    }
    if (config.ignoreMethods.includes(fn.name)) {
      continue
    }
    if (fn.inputs.length === 0) {
      methodHandlers.push(new SimpleMethodHandler(fn))
    } else if (fn.inputs.length === 1 && fn.inputs[0]?.type === 'uint256') {
      arrayHandlers.push(new LimitedArrayHandler(fn, PROBED_INDICES))
    }
  }

  return methodHandlers.concat(arrayHandlers)
}
