import type { DaBridge, IntegratedDacBridge, NoDacBridge } from '@l2beat/config'
export function getPermissionedEntities(
  bridge: DaBridge | IntegratedDacBridge | NoDacBridge,
) {
  if (
    bridge.type === 'IntegratedDacBridge' ||
    bridge.type === 'StandaloneDacBridge'
  ) {
    return bridge.knownMembers
  }

  return []
}
