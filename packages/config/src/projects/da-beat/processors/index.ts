import type { BlockchainDaLayer, DacDaLayer } from '../types'
import { committeeSecurityRisk } from './committee-security-risk'
import { dacSignersWarning } from './dac-signers-warning'

export type DaBeatProjectProcessor<T extends BlockchainDaLayer | DacDaLayer> = (
  layer: T,
) => T

const processors = [dacSignersWarning, committeeSecurityRisk]

export function applyProcessor(
  layers: (BlockchainDaLayer | DacDaLayer)[],
): (BlockchainDaLayer | DacDaLayer)[] {
  return layers.map((layer) => {
    return processors.reduce((layer, processor) => processor(layer), layer)
  })
}
