import { EthereumAddress } from '@l2beat/types'
import { utils } from 'ethers'

import { DiscoveryConfig } from './DiscoveryConfig'
import { Handler, HandlerResult } from './handlers/Handler'
import { LimitedArrayHandler } from './handlers/LimitedArrayHandler'
import { SimpleMethodHandler } from './handlers/SimpleMethodHandler'
import { DiscoveryProvider } from './provider/DiscoveryProvider'

export async function getParameters(
  abiEntries: string[],
  address: EthereumAddress,
  provider: DiscoveryProvider,
  config: DiscoveryConfig,
): Promise<HandlerResult[]> {
  const overrides = config.overrides?.[address.toString()]

  const abi = new utils.Interface(abiEntries)
  const viewFunctions = Object.entries(abi.functions)
    .map((x) => x[1])
    .filter((x) => x.stateMutability === 'view' || x.constant)
    .filter((x) => !overrides?.ignoreMethods?.includes(x.name))

  const handlers: Handler[] = [
    ...viewFunctions
      .filter((x) => x.inputs.length === 0)
      .map((x) => new SimpleMethodHandler(x)),
    ...viewFunctions
      .filter((x) => x.inputs.length === 1 && x.inputs[0].type === 'uint256')
      .map((x) => new LimitedArrayHandler(x)),
  ]

  return Promise.all(
    handlers.map((h) => h.execute(provider, address, abiEntries)),
  )
}
