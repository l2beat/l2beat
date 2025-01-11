import { DaBeatProjectProcessor } from '.'
import {
  BlockchainDaLayer,
  DaServiceDaLayer,
  DacBridge,
  DacDaLayer,
  NoDaBridge,
} from '../types'

export const dacSignersWarning: DaBeatProjectProcessor<
  DacDaLayer | BlockchainDaLayer | DaServiceDaLayer
> = (layer) => {
  if (layer.kind !== 'DAC') {
    return layer
  }

  return {
    ...layer,
    bridge: attachSignersWarning(layer.bridge),
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
