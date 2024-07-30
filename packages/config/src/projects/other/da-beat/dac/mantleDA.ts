import { DaEconomicSecurityRisk, DaFraudDetectionRisk } from '../types'
import { DaLayer } from '../types/DaLayer'
import { immutableXDac } from './bridges/immutablex'

/**
 * THIS IS EXAMPLE DATA FOR SKETCH PURPOSES
 */
export const mantleDA: DaLayer = {
  id: 'dac',
  type: 'DaLayer',
  kind: 'DAC',
  display: {
    name: 'MantleDA',
    slug: 'mantle-da',
    description:
      'Set of parties responsible for signing and attesting to the availability of data.',
    links: {
      websites: [],
      documentation: [
      ],
      repositories: [],
      apps: [],
      explorers: [],
      socialMedia: [],
    },
  },
  technology:
    'Some note about the technology used by the data availability layer.\n## Markdown supported',
  bridges: [immutableXDac],
  usedIn: [...immutableXDac.usedIn],
  risks: {
    economicSecurity: DaEconomicSecurityRisk.Unknown,
    fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
  },
}
