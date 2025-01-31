import type { DaBridge } from '@l2beat/config'

// If there is any bridge there is bridge implementation, and no one uses NoBridge, then we do not want to show NoBridge
export function excludeRedundantNoBridge(
  bridge: DaBridge,
  _: number,
  bridges: DaBridge[],
) {
  const hasOtherBridges = bridges.some((b) => b.type !== 'NoBridge')
  const isUnusedNoBridge =
    bridge.type === 'NoBridge' && bridge.usedIn.length === 0

  if (hasOtherBridges && isUnusedNoBridge) {
    return false
  }
  return true
}
