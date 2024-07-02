import {
  chains,
  isDacBridge,
  isOnChainBridge,
  type DaBridge,
} from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'

interface OnChainBridge {
  type: 'OnChain'
  name: string
  network: string
}

interface DACBridge {
  type: 'DAC'
  name: string
  requiredMembers: number
  totalMembers: number
}

export type DaSummaryEntryBridge = OnChainBridge | DACBridge

export function toDaBridge(bridge: DaBridge): DaSummaryEntryBridge | null {
  if (isDacBridge(bridge)) {
    return {
      type: 'DAC',
      name: bridge.display.name,
      requiredMembers: bridge.requiredMembers,
      totalMembers: bridge.totalMembers,
    }
  }

  if (isOnChainBridge(bridge)) {
    const chain = chains.find((c) => c.name === bridge.chain)
    assert(chain !== undefined, 'Chain not found')
    return {
      type: 'OnChain',
      name: bridge.display.name,
      network: chain.name,
    }
  }

  return null
}
