import { DaRiskViewOptions } from './DaRiskView'

export type DaAccessibilityRisk = typeof Enshrined | typeof NotEnshrined

const Enshrined = {
  type: 'Enshrined',
  value: 'Enshrined',
  sentiment: 'good',
  description: 'The DA bridge is enshrined in Ethereum.',
} as const

const NotEnshrined = {
  type: 'NotEnshrined',
  value: 'External',
  sentiment: 'warning',
  description:
    'The DA bridge is not enshrined in Ethereum. This introduces an additional trust assumption on the honest majority of DA layer validators or committee.',
} as const

export const DaAccessibilityRisk = {
  Enshrined,
  NotEnshrined,
} satisfies DaRiskViewOptions
