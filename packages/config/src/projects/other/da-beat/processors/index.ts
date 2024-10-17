import { DaLayer } from '../types'
import { committeeSecurityRisk } from './committee-security-risk'
import { dacSignersWarning } from './dac-signers-warning'

export type DaBeatProjectProcessor = (layer: DaLayer) => DaLayer

const processors: DaBeatProjectProcessor[] = [
  dacSignersWarning,
  committeeSecurityRisk,
]

export function applyProcessor(layers: DaLayer[]): DaLayer[] {
  return layers.map((layer) => {
    return processors.reduce((layer, processor) => processor(layer), layer)
  })
}
