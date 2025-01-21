import type { DaBeatProjectProcessor } from '.'
import type {
  BlockchainDaLayer,
  DacBridge,
  DacDaLayer,
  NoDaBridge,
} from '../types'

export const dacSignersWarning: DaBeatProjectProcessor<
  DacDaLayer | BlockchainDaLayer
> = (layer) => {
  if (layer.kind !== 'DAC') {
    return layer
  }

  return {
    ...layer,
    bridges: layer.bridges.map(attachSignersWarning),
  }
}

function attachSignersWarning(
  bridge: DacBridge | NoDaBridge,
): DacBridge | NoDaBridge {
  if (bridge.type === 'DAC' && bridge.requiredMembers === 1) {
    const additionalWarning =
      'Only one signer is required to attest to the availability of the data.'

    return {
      ...bridge,
      display: {
        ...bridge.display,
        redWarning: bridge.display.redWarning
          ? `${bridge.display.redWarning}\n${additionalWarning}`
          : additionalWarning,
      },
    }
  }

  return bridge
}
