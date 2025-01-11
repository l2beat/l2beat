import { DacDaLayer } from '../types'
import { committeeSecurityRisk } from './committee-security-risk'

export type DaBeatProjectProcessor<T extends DacDaLayer> = (layer: T) => T

const processors = [committeeSecurityRisk]

export function applyProcessor(layers: DacDaLayer[]): DacDaLayer[] {
  return layers.map((layer) => {
    return processors.reduce((layer, processor) => processor(layer), layer)
  })
}
