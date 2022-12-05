import { EthereumAddress } from '@l2beat/types'
import { utils } from 'ethers'

import { DiscoveryConfig } from '../DiscoveryConfig'
import { Handler } from './Handler'
import { LimitedArrayHandler } from './system/LimitedArrayHandler'
import { SimpleMethodHandler } from './system/SimpleMethodHandler'

export function getSystemHandlers(
  abiEntries: string[],
  address: EthereumAddress,
  config: DiscoveryConfig,
) {
  const overrides = config.overrides?.[address.toString()]
  const abi = new utils.Interface(abiEntries)

  const handlers: Handler[] = []

  for (const fn of Object.values(abi.functions)) {
    if (
      (fn.stateMutability !== 'view' && !fn.constant) ||
      overrides?.ignoreMethods?.includes(fn.name)
    ) {
      continue
    } else if (fn.inputs.length === 0) {
      handlers.push(new SimpleMethodHandler(fn))
    } else if (fn.inputs[0].type === 'uint256') {
      handlers.push(new LimitedArrayHandler(fn))
    }
  }

  return handlers
}
