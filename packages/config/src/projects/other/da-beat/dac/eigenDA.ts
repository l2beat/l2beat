import { DaEconomicSecurityRisk, DaFraudDetectionRisk } from '../types'
import { DaLayer } from '../types/DaLayer'
import { eigenDAbridge } from './bridges/eigenDABridge'

export const eigenDA: DaLayer = {
  id: 'eigen-da',
  type: 'DaLayer',
  kind: 'DAC',
  display: {
    name: 'Eigen DA',
    slug: 'eigenda',
    description:
      'EigenDA is a data availability solution built on Eigen Layer.',
    links: {
      websites: [],
      documentation: [],
      repositories: [],
      apps: [],
      explorers: [],
      socialMedia: [],
    },
  },
  technology: `
    
  `,
  bridges: [eigenDAbridge],
  usedIn: [],
  risks: {
    economicSecurity: DaEconomicSecurityRisk.Unknown,
    fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
  },
}
