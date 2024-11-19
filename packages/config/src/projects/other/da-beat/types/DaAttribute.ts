import { DaRiskWithSentiment } from './DaRiskView'

type DaAttribute = Omit<DaRiskWithSentiment, 'sentiment'>
export type DaAttributes = Record<string, DaAttribute>
