import { DaRiskWithSentiment } from './DaRiskView'

export type DaAttribute = Omit<DaRiskWithSentiment, 'sentiment'>
export type DaAttributes = Record<string, DaAttribute>
