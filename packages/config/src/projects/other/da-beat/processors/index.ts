import { DaLayer } from '../types'
import { dacSignersWarning } from './dac-signers-warning'

export type DaBeatProjectProcessor = (layer: DaLayer) => DaLayer

const processors: DaBeatProjectProcessor[] = [dacSignersWarning]

export function applyProcessor(layers: DaLayer[]): DaLayer[] {
  return layers.map((layer) => {
    return processors.reduce((layer, processor) => processor(layer), layer)
  })
}
