import { DaRiskViewOptions } from './DaRiskView'

export type DaAccessabilityRisk = typeof Enshrined | typeof NotEnshrined

const Enshrined = {
  type: 'Enshrined',
  value: 'Enshrined',
  sentiment: 'good',
  description: 'TODO',
} as const

const NotEnshrined = {
  type: 'NotEnshrined',
  value: 'External',
  sentiment: 'bad',
  description: 'TODO',
} as const

export const DaAccessabilityRisk = {
  Enshrined,
  NotEnshrined,
} satisfies DaRiskViewOptions
