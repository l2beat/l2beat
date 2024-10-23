import { Sentiment } from '@l2beat/shared-pure'
import { DaRiskViewOptions } from './DaRiskView'

export type DaCommitteeSecurityRisk =
  | ReturnType<typeof RobustAndDiverseCommittee>
  | ReturnType<typeof LimitedCommitteeSecurity>
  | ReturnType<typeof NoCommiteeSecurity>
  | ReturnType<typeof NoDiversityCommiteeSecurity>
  | ReturnType<typeof NoHonestMinimumCommiteeSecurity>
  | typeof NoBridge
  | ReturnType<typeof Auto>

const RobustAndDiverseCommittee = (value?: string) =>
  ({
    type: 'RobustAndDiverseCommittee',
    value: value ?? 'Permissionless',
    sentiment: 'good',
    description: `The committee requires an honest minority (1/3 or less) of members (or the network stake) to prevent the DA bridge from accepting an unavailable data commitment. 
    Participation in the committee is permissionless, based only on stake requirements and an honest majority of validators processing the new operator's request to join the active set.`,
  }) as const

const LimitedCommitteeSecurity = (value?: string) =>
  ({
    type: 'LimitedCommitteeSecurity',
    value: value ?? 'Permissioned',
    sentiment: 'warning',
    description: `The committee requires an honest minority (1/3 or less) of members (or the network stake) to prevent the DA bridge from accepting an unavailable data commitment.
    There are at least 5 external actors in the committee, but entry or exit of members is partially controlled by a centralized entity.`,
  }) as const

const NoCommiteeSecurity = (value?: string) =>
  ({
    type: 'NoCommiteeSecurity',
    value: value ?? 'No Committee Security',
    sentiment: 'bad',
    description: `The committee does not meet basic security standards, either due to insufficient size, lack of member diversity, or poorly defined threshold parameters. The system lacks an effective DA bridge and it is reliant on the assumption of an honest sequencer, creating significant risks to data integrity and availability.`,
  }) as const

const NoDiversityCommiteeSecurity = (value?: string) =>
  ({
    type: 'NoDiversityCommiteeSecurity',
    value: value ?? 'No Committee Security',
    sentiment: 'bad',
    description: `The committee requires an honest minority (1/3 or less) of members (or the network stake) to prevent the DA bridge from accepting an unavailable data commitment.
    However, the committee is not diverse enough to prevent a single entity from controlling the majority of the committee.
    `,
  }) as const

  const NoHonestMinimumCommiteeSecurity = (value?: string, honestMembersPercentage?: string) =>
  ({
    type: 'NoHonestMinimumCommiteeSecurity',
    value: value ?? 'No Committee Security',
    sentiment: 'bad',
    description: `The committee should require an honest minority (33% or less) of members to prevent the DA bridge from accepting an unavailable data commitment.
   Currently, this committee requires ${honestMembersPercentage}% of members to be honest. `,
  }) as const

const NoBridge = {
  type: 'NoBridge',
  value: 'N/A',
  sentiment: 'bad',
  description:
    'Without a DA bridge, there is no committee attesting to the availability of data. The scaling solution using this DA layer relies only on the honesty of the sequencer.',
} as const

const Auto = (params?: {
  resolved: {
    value: string
    sentiment: Sentiment
  }
}) =>
  ({
    type: 'Auto',
    // Will be overwritten by a processor
    value: params?.resolved.value ?? '',
    sentiment: params?.resolved.sentiment ?? 'bad',
    description:
      params?.resolved.sentiment === 'bad'
        ? NoCommiteeSecurity().description
        : params?.resolved.sentiment === 'warning'
          ? LimitedCommitteeSecurity().description
          : '',
  }) as const

export const DaCommitteeSecurityRisk = {
  RobustAndDiverseCommittee,
  LimitedCommitteeSecurity,
  NoCommiteeSecurity,
  NoDiversityCommiteeSecurity,
  NoHonestMinimumCommiteeSecurity,
  NoBridge,
  Auto,
} as const satisfies DaRiskViewOptions
