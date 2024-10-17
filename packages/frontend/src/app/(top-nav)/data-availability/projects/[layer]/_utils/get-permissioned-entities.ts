import { type DaBridge } from '@l2beat/config'

export function getPermissionedEntities(bridge: DaBridge) {
  if (bridge.type !== 'DAC') {
    return
  }

  return bridge.knownMembers
}
