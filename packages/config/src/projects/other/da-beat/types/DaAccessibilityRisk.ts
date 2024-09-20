import { DaRiskViewOptions } from './DaRiskView'

export type DaAccessibilityRisk = typeof Enshrined | typeof NotEnshrined

const Enshrined = {
  type: 'Enshrined',
  value: 'Enshrined',
  sentiment: 'good',
  description:
    'Blob data on Ethereum can natively be accessed by a bridge since they live on the same network. Data availability is ensured by Ethereum’s consensus rules without the need for additional trust assumptions.',
} as const

const NotEnshrined = {
  type: 'NotEnshrined',
  value: 'External',
  sentiment: 'warning',
  description: `The DA bridge is not enshrined in Ethereum, meaning Ethereum cannot natively verify data availability since it doesn't download or sample the data. Instead, it relies on attestations from an external consensus mechanism, introducing a trust assumption on the honest majority of DA layer validators participating in that consensus.`,
} as const

export const DaAccessibilityRisk = {
  Enshrined,
  NotEnshrined,
} satisfies DaRiskViewOptions
