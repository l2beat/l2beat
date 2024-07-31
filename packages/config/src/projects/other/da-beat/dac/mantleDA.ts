import { DaEconomicSecurityRisk, DaFraudDetectionRisk } from '../types'
import { DaLayer } from '../types/DaLayer'
import { mantleDABridge } from './bridges/mantleDABridge'

export const mantleDA: DaLayer = {
  id: 'dac',
  type: 'DaLayer',
  kind: 'DAC',
  display: {
    name: 'MantleDA',
    slug: 'mantle-da',
    description:
      'MantleDA is a data availability solution built on EigenDA contracts, which have been forked and significantly modified.',
    links: {
      websites: ['https://mantle.xyz'],
      documentation: [
        'https://docs-v2.mantle.xyz/intro/risk-management/da'
      ],
      repositories: [
        'https://github.com/mantlenetworkio'
      ],
      apps: [],
      explorers: ['https://explorer.mantle.xyz/mantle-da'],
      socialMedia: ['https://twitter.com/0xMantle', 'https://t.me/mantlenetwork'],
    },
  },
  technology:
    'Some note about the technology used by the data availability layer.\n## Markdown supported',
  bridges: [mantleDABridge],
  usedIn: [...mantleDABridge.usedIn],
  risks: {
    economicSecurity: DaEconomicSecurityRisk.Unknown,
    fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
  },
}
