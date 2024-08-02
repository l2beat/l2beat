import { DaBridge, DaLayer } from '../projects'

export function getDaProjectKey(daLayer: DaLayer, bridge: DaBridge): string {
  return `${daLayer.id}-${bridge.id}`
}
