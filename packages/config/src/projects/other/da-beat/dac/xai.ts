import { DaEconomicSecurityRisk, DaFraudDetectionRisk } from '../types'
import { DaLayer } from '../types/DaLayer'
import { xaiDac } from './bridges/xai'

export const xaiLayer: DaLayer = {
  id: 'xai-dac-layer',
  type: 'DaLayer',
  kind: 'DAC',
  display: {
    name: 'XAI DAC',
    slug: 'xai',
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
  bridges: [xaiDac],
  usedIn: [...xaiDac.usedIn],
  risks: {
    economicSecurity: DaEconomicSecurityRisk.OffChainVerifiable,
    fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
  },
}
