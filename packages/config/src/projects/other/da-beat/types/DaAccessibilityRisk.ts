import { DaRiskViewOptions } from './DaRiskView'

export type DaAccessibilityRisk = typeof Enshrined | typeof NotEnshrined

const Enshrined = {
  type: 'Enshrined',
  value: 'Enshrined',
  sentiment: 'good',
  description: 'TODO',
} as const

const NotEnshrined = {
  type: 'NotEnshrined',
  value: 'External',
  sentiment: 'warning',
  description: 'TODO',
} as const

export const DaAccessibilityRisk = {
  Enshrined,
  NotEnshrined,
} satisfies DaRiskViewOptions
