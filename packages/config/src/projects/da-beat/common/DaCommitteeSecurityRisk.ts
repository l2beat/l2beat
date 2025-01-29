import type { IntegratedDacBridge, TableReadyValue } from '../../../types'

function RobustAndDiverseCommittee(value?: string): TableReadyValue {
  return {
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
): TableReadyValue {
  return {
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

function NoCommitteeSecurity(value?: string): TableReadyValue {
  return {
    value: value ?? 'None',
    sentiment: 'bad',
    description: `The committee does not meet basic security standards, either due to insufficient size, lack of member diversity, or poorly defined threshold parameters. The system lacks an effective DA bridge and it is reliant on the assumption of an honest sequencer, creating significant risks to data integrity and availability.`,
  }
}

function NoDiversityCommitteeSecurity(value?: string): TableReadyValue {
  return {
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
): TableReadyValue {
  return {
    value: value ?? 'None',
    sentiment: 'bad',
    description: `The committee should require an honest minority (33% or less) of members to prevent the DA bridge from accepting an unavailable data commitment.
   Currently, an honest minority is not able to prevent an unavailable data commitment from being accepted, as this committee requires ${honestMembersPercentage}% of members to be honest. `,
  }
}

const NoBridge: TableReadyValue = {
  value: 'N/A',
  sentiment: 'bad',
  description: 'There is no committee attesting to the availability of data. ',
}

function AutoDAC(params: {
  membersCount: number
  requiredMembers: number
  knownMembers: IntegratedDacBridge['knownMembers']
}): TableReadyValue {
  const sentiment = getDacSentiment(params)
  return {
    value: `${params.requiredMembers}/${params.membersCount}`,
    sentiment,
    description:
      sentiment === 'bad'
        ? NoCommitteeSecurity().description
        : LimitedCommitteeSecurity().description,
  }
}

function getDacSentiment(params: {
  membersCount: number
  requiredMembers: number
  knownMembers: IntegratedDacBridge['knownMembers']
}) {
  if (!params.knownMembers) return 'bad'

  const assumedHonestMembers = params.membersCount - params.requiredMembers + 1

  // If less than 6 members or more than 1/3 of members need to be honest, the sentiment is bad
  if (
    params.knownMembers.length < 6 ||
    assumedHonestMembers / params.knownMembers.length > 1 / 3
  ) {
    return 'bad'
  }

  // If less than 5 members are external, the sentiment is bad
  if (params.knownMembers.filter((member) => member.external).length < 5) {
    return 'bad'
  }

  return 'warning'
}

export const DaCommitteeSecurityRisk = {
  RobustAndDiverseCommittee,
  LimitedCommitteeSecurity,
  NoCommitteeSecurity,
  NoDiversityCommitteeSecurity,
  NoHonestMinimumCommitteeSecurity,
  NoBridge,
  AutoDAC,
}
