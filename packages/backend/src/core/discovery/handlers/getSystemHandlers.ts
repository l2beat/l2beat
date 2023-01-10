import { utils } from 'ethers'

import { DiscoveryContract } from '../DiscoveryConfig'
import { DiscoveryLogger } from '../DiscoveryLogger'
import { Handler } from './Handler'
import { LimitedArrayHandler } from './system/LimitedArrayHandler'
import { SimpleMethodHandler } from './system/SimpleMethodHandler'

export function getSystemHandlers(
  abiEntries: string[],
  overrides: DiscoveryContract | undefined,
  logger: DiscoveryLogger,
) {
  const abi = new utils.Interface(abiEntries)

  const methodHandlers: Handler[] = []
  const arrayHandlers: Handler[] = []

  for (const fn of Object.values(abi.functions)) {
    if (
      (fn.stateMutability !== 'view' && !fn.constant) ||
      overrides?.ignoreMethods?.includes(fn.name)
    ) {
      continue
    } else if (fn.inputs.length === 0) {
      methodHandlers.push(new SimpleMethodHandler(fn, logger))
    } else if (fn.inputs.length === 1 && fn.inputs[0].type === 'uint256') {
      arrayHandlers.push(new LimitedArrayHandler(fn, 5, logger))
    }
  }

  return methodHandlers.concat(arrayHandlers)
}
