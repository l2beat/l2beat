import { type DaBridge, type IntegratedDacBridge } from '@l2beat/config'
export function getPermissionedEntities(
  bridge: DaBridge | IntegratedDacBridge,
) {
  if (
    bridge.type === 'IntegratedDacBridge' ||
    bridge.type === 'StandaloneDacBridge'
  ) {
    return bridge.knownMembers
  }

  return []
}
