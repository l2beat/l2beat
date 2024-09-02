import { DaEconomicSecurityRisk, DaFraudDetectionRisk } from '../types'
import { DaLayer } from '../types/DaLayer'
import { immutableXDac } from './bridges/immutablex'

export const immutableXLayer: DaLayer = {
  id: 'immutablex-dac-layer',
  type: 'DaLayer',
  kind: 'DAC',
  display: {
    name: 'Immutable-X DAC',
    slug: 'immutablex',
    description:
      'Set of parties responsible for signing and attesting to the availability of data.',
    links: {
      websites: [],
      documentation: [],
      repositories: [],
      apps: [],
      explorers: [],
      socialMedia: [],
    },
  },
  technology: `## Simple Committee
  The Data Availability Committee (DAC) is a set of trusted parties responsible for storing data off-chain and serving it upon demand. 
  The security guarantees of DACs depend on the specific setup and can vary significantly based on the criteria for selecting committee members, 
  their operational transparency, and the mechanisms in place to handle disputes and failures.
  `,
  bridges: [immutableXDac],
  usedIn: [...immutableXDac.usedIn],
  risks: {
    economicSecurity: DaEconomicSecurityRisk.OffChainVerifiable,
    fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
  },
}
