import { ValueWithSentiment } from '@l2beat/shared-pure'

export type DaRiskWithSentiment = ValueWithSentiment<string> & {
  type: string
}

export type DaRiskViewOptions = Record<
  string,
  // biome-ignore lint/suspicious/noExplicitAny: we do not care about the type of the arguments
  DaRiskWithSentiment | ((...args: any[]) => DaRiskWithSentiment)
>

export type DaRiskView = Record<string, DaRiskWithSentiment>
