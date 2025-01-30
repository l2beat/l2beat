import type { DaBridge } from '@l2beat/config'

export function getPermissionedEntities(bridge: DaBridge) {
  return bridge.dac?.knownMembers
}
