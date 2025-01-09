import { BlockchainDaLayer, DaServiceDaLayer, DacDaLayer } from '../types'
import { committeeSecurityRisk } from './committee-security-risk'
import { dacSignersWarning } from './dac-signers-warning'

export type DaBeatProjectProcessor<
  T extends BlockchainDaLayer | DacDaLayer | DaServiceDaLayer,
> = (layer: T) => T

const processors = [dacSignersWarning, committeeSecurityRisk]

export function applyProcessor(
  layers: (BlockchainDaLayer | DacDaLayer | DaServiceDaLayer)[],
): (BlockchainDaLayer | DacDaLayer | DaServiceDaLayer)[] {
  return layers.map((layer) => {
    return processors.reduce((layer, processor) => processor(layer), layer)
  })
}
