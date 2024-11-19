import { utils } from 'ethers'

import { ContractOverrides } from '../config/DiscoveryOverrides'
import { Handler } from './Handler'
import { LimitedArrayHandler } from './system/LimitedArrayHandler'
import { SimpleMethodHandler } from './system/SimpleMethodHandler'

export function getSystemHandlers(
  abiEntries: string[],
  overrides: ContractOverrides | undefined,
): Handler[] {
  const abi = new utils.Interface(abiEntries)

  const methodHandlers: Handler[] = []
  const arrayHandlers: Handler[] = []

  for (const fn of Object.values(abi.functions)) {
    if (!fn.constant || (fn.outputs?.length ?? 0) === 0) {
      // function is neither pure nor view, or simply doesn't return anything
      continue
    } else if (overrides?.ignoreMethods?.includes(fn.name)) {
      continue
    } else if (fn.inputs.length === 0) {
      methodHandlers.push(new SimpleMethodHandler(fn))
    } else if (fn.inputs.length === 1 && fn.inputs[0]?.type === 'uint256') {
      arrayHandlers.push(new LimitedArrayHandler(fn, 5))
    }
  }

  return methodHandlers.concat(arrayHandlers)
}
