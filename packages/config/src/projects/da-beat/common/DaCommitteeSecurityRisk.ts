import type { Sentiment } from '@l2beat/shared-pure'
import type { DaRisk } from '../types'

function RobustAndDiverseCommittee(value?: string): DaRisk {
  return {
    type: 'RobustAndDiverseCommittee',
    value: value ?? 'Permissionless',
    sentiment: 'good',
    description: `The committee requires an honest minority (less than 1/3) of members (or the network stake) to prevent the DA bridge from accepting an unavailable data commitment. 
    Participation in the committee is permissionless, based only on stake requirements and an honest majority of validators processing the new operator's request to join the active set.`,
  }
}

function LimitedCommitteeSecurity(
  value?: string,
  externalMembersPercentage?: string,
  totalNumberOfOperators?: number,
): DaRisk {
  return {
    type: 'LimitedCommitteeSecurity',
    value: value ?? 'Permissioned',
    sentiment: 'warning',
    description: `The committee requires an honest minority (less than 1/3) of members (or the network stake) to prevent the DA bridge from accepting an unavailable data commitment.
        ${
          totalNumberOfOperators
            ? `There are ${totalNumberOfOperators} operators currently registered in the committee, but entry or exit of members is partially controlled by a centralized entity.`
            : `There are at least 5 external actors in the committee${
                externalMembersPercentage
                  ? ` (${externalMembersPercentage}%)`
                  : ''
              }, but entry or exit of members is partially controlled by a centralized entity.`
        }`,
  }
}

function NoCommitteeSecurity(value?: string): DaRisk {
  return {
    type: 'NoCommitteeSecurity',
    value: value ?? 'None',
    sentiment: 'bad',
    description: `The committee does not meet basic security standards, either due to insufficient size, lack of member diversity, or poorly defined threshold parameters. The system lacks an effective DA bridge and it is reliant on the assumption of an honest sequencer, creating significant risks to data integrity and availability.`,
  }
}

function NoDiversityCommitteeSecurity(value?: string): DaRisk {
  return {
    type: 'NoDiversityCommitteeSecurity',
    value: value ?? 'None',
    sentiment: 'bad',
    description: `The committee requires an honest minority (less than 1/3) of members (or the network stake) to prevent the DA bridge from accepting an unavailable data commitment.
    However, the committee is not diverse enough to prevent a single entity from controlling the majority of the committee.
    `,
  }
}

function NoHonestMinimumCommitteeSecurity(
  value?: string,
  honestMembersPercentage?: string,
): DaRisk {
  return {
    type: 'NoHonestMinimumCommitteeSecurity',
    value: value ?? 'None',
    sentiment: 'bad',
    description: `The committee should require an honest minority (33% or less) of members to prevent the DA bridge from accepting an unavailable data commitment.
   Currently, an honest minority is not able to prevent an unavailable data commitment from being accepted, as this committee requires ${honestMembersPercentage}% of members to be honest. `,
  }
}

const NoBridge: DaRisk = {
  type: 'NoBridge',
  value: 'N/A',
  sentiment: 'bad',
  description: 'There is no committee attesting to the availability of data. ',
}

function Auto(params?: {
  resolved: { value: string; sentiment: Sentiment }
}): DaRisk {
  return {
    type: 'Auto',
    // Will be overwritten by a processor
    value: params?.resolved.value ?? '',
    sentiment: params?.resolved.sentiment ?? 'bad',
    description:
      params?.resolved.sentiment === 'bad'
        ? NoCommitteeSecurity().description
        : params?.resolved.sentiment === 'warning'
          ? LimitedCommitteeSecurity().description
          : '',
  }
}

export const DaCommitteeSecurityRisk = {
  RobustAndDiverseCommittee,
  LimitedCommitteeSecurity,
  NoCommitteeSecurity,
  NoDiversityCommitteeSecurity,
  NoHonestMinimumCommitteeSecurity,
  NoBridge,
  Auto,
}
