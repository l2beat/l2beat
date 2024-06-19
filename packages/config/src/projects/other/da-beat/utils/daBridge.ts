import { DaBridge, DacBridge, OnChainDaBridge } from '../types'

export function isOnChainBridge(bridge: DaBridge): bridge is OnChainDaBridge {
  return bridge.kind.type === 'OnChainBridge'
}

export function isDacBridge(bridge: DaBridge): bridge is DacBridge {
  return bridge.kind.type === 'DAC'
}
