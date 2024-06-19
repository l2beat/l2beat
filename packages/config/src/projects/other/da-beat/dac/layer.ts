import { DaEconomicSecurityRisk, DaFraudDetectionRisk } from '../types'
import { DaLayer, DaLayerKind } from '../types/DaLayer'
import { immutableXDac } from './bridges/immutablex'

/**
 * THIS IS EXAMPLE DATA FOR SKETCH PURPOSES
 */
export const dac: DaLayer = {
  id: 'dac',
  kind: DaLayerKind.DAC,
  display: {
    name: 'Data Availability Committee (DAC)',
    slug: 'dac',
    description:
      'Set of parties responsible for signing and attesting to the availability of data.',
  },
  bridges: [immutableXDac],
  usedIn: [...immutableXDac.usedIn],
  risks: {
    economicSecurity: DaEconomicSecurityRisk.Unknown,
    fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
  },
}
