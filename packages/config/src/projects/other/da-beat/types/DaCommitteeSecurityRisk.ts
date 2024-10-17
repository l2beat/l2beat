import { Sentiment } from '@l2beat/shared-pure'
import { DaRiskViewOptions } from './DaRiskView'

export type DaCommitteeSecurityRisk = {
  [key in keyof typeof DaCommitteeSecurityRisk]: (typeof DaCommitteeSecurityRisk)[key] extends (
    // biome-ignore lint/suspicious/noExplicitAny: expected
    ...args: any
    // biome-ignore lint/suspicious/noExplicitAny: expected
  ) => any
    ? ReturnType<(typeof DaCommitteeSecurityRisk)[key]>
    : (typeof DaCommitteeSecurityRisk)[key]
}[keyof typeof DaCommitteeSecurityRisk]

const RobustAndDiverseCommittee = (value: string) =>
  ({
    type: 'RobustAndDiverseCommittee',
    value,
    sentiment: 'good',
    description: `The committee is robust and diverse.`,
  }) as const

const LimitedCommitteeSecurity = (value: string) =>
  ({
    type: 'LimitedCommitteeSecurity',
    value,
    sentiment: 'warning',
    description: `The committee is limited and does not have the necessary diversity.`,
  }) as const

const NoCommiteeSecurity = (value: string) =>
  ({
    type: 'NoCommiteeSecurity',
    value,
    sentiment: 'bad',
    description: `The committee is not secure and does not have the necessary diversity.`,
  }) as const

const NoBridge = {
  type: 'NoBridge',
  value: 'None',
  sentiment: 'bad',
  description: 'No data availability attestations are posted to Ethereum.',
} as const

const Auto = (params?: {
  resolved: {
    value: string
    sentiment: Sentiment
    description: string
  }
}) =>
  ({
    type: 'Auto',
    // Will be overwritten by a processor
    value: params?.resolved.value ?? '',
    sentiment: params?.resolved.sentiment ?? 'bad',
    description: params?.resolved.description ?? '',
  }) as const

export const DaCommitteeSecurityRisk = {
  RobustAndDiverseCommittee,
  LimitedCommitteeSecurity,
  NoCommiteeSecurity,
  NoBridge,
  Auto,
} as const satisfies DaRiskViewOptions
