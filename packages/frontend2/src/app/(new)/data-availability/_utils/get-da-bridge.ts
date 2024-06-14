import {
  type DaBridge,
  chains,
  isDacBridge,
  isOnChainBridge,
} from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { type DataAvailabilityProvider } from '../summary/_components/table/columns'

export function toDaBridge(
  bridge: DaBridge,
): DataAvailabilityProvider['daBridge'] {
  if (isDacBridge(bridge)) {
    return {
      type: 'DAC',
      name: bridge.display.name,
      requiredMembers: bridge.requiredMembers,
      totalMembers: bridge.totalMembers,
    }
  }

  if (isOnChainBridge(bridge)) {
    const chain = chains.find((c) => c.chainId === bridge.chain.valueOf())
    assert(chain !== undefined, 'Chain not found')
    return {
      type: 'OnChain',
      name: bridge.display.name,
      network: chain.name,
    }
  }

  return null
}
