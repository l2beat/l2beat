import { DaRiskViewOptions } from './DaRiskView'

export type DaAccessabilityRisk = typeof ENSHRINED | typeof NOT_ENSHRINED

const ENSHRINED = {
  type: 'ENSHRIRNED',
  value: 'Enshrined',
  sentiment: 'good',
  description: 'TODO',
} as const

const NOT_ENSHRINED = {
  type: 'NOT_ENSHRINED',
  value: 'External',
  sentiment: 'bad',
  description: 'TODO',
} as const

export const DaAccessabilityRisk = {
  ENSHRINED,
  NOT_ENSHRINED,
} satisfies DaRiskViewOptions
