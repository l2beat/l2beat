import { NO_BRIDGE } from '../../templates/no-bridge-template'
import { DaEconomicSecurityRisk } from '../../types/DaEconomicSecurityRisk'
import { DaFraudDetectionRisk } from '../../types/DaFraudDetectionRisk'
import { DaLayer } from '../../types/DaLayer'
import { linkByDA } from '../../utils/link-by-da'

export const memo: DaLayer = {
  id: 'memo',
  type: 'DaLayer',
  kind: 'PublicBlockchain',
  display: {
    name: 'MemoDA',
    slug: 'memo',
    description: `MEMO is a blockchain-based cloud storage protocol developed by MEMO Labs.`,
    links: {
      websites: ['https://www.memolabs.org/'],
      documentation: [
        'https://docs.memolabs.org/#/',
      ],
      repositories: [
        'https://github.com/memoio',
      ],
      apps: [],
      explorers: ['https://scan.metamemo.one:8080/'],
      socialMedia: [
        'https://x.com/MemoLabsOrg',
        'https://discord.com/invite/YG4Ydv2E7X',
      ],
    },
  },
  consensusAlgorithm: {
    name: '',
    description: ``,
    blockTime: 0, // seconds average
    consensusFinality: 0, 
    unbondingPeriod: 0, 
  },
  technology: `
  `,
  bridges: [
    NO_BRIDGE({
      layer: 'MemoDA',
    }),
  ],
  usedIn: linkByDA({
    layer: (layer) => layer === 'MemoDA',
  }),
  pruningWindow: 0,
  risks: {
    economicSecurity: DaEconomicSecurityRisk.OnChainQuantifiable,
    fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
  },
  economicSecurity: {
    type: 'MemoDA',
  },
}
