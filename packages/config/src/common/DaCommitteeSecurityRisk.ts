import type { DacInfo, TableReadyValue } from '../types'

function RobustAndDiverseCommittee(value?: string): TableReadyValue {
  return {
    value: value ?? 'Permissionless',
    sentiment: 'good',
    description: `The committee requires an honest minority (less than 1/3) of members (or the network stake) to prevent the DA bridge from accepting an unavailable data commitment. 
    Participation in the committee is permissionless, based only on stake requirements and an honest majority of validators processing the new operator's request to join the active set.`,
    orderHint: 2,
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
    orderHint: 1,
  }
}

function NoCommitteeSecurity(value?: string): TableReadyValue {
  return {
    value: value ?? 'None',
    sentiment: 'bad',
    description:
      'The committee does not meet basic security standards, either due to insufficient size, lack of member diversity, or poorly defined threshold parameters. The system lacks an effective DA bridge and it is reliant on the assumption of an honest sequencer, creating significant risks to data integrity and availability.',
    orderHint: -1,
  }
}

function NoDiversityCommitteeSecurity(value?: string): TableReadyValue {
  return {
    value: value ?? 'None',
    sentiment: 'bad',
    description: `The committee requires an honest minority (less than 1/3) of members (or the network stake) to prevent the DA bridge from accepting an unavailable data commitment.
    However, the committee is not diverse enough to prevent a single entity from controlling the majority of the committee.
    `,
    orderHint: -1,
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
    orderHint: -1,
  }
}

function AutoDAC(params: {
  membersCount: number
  requiredMembers: number
  knownMembers: DacInfo['knownMembers']
}): TableReadyValue {
  const sentiment = getDacSentiment(params)
  return {
    value: `${params.requiredMembers}/${params.membersCount}`,
    sentiment,
    description:
      sentiment === 'bad'
        ? NoCommitteeSecurity().description
        : LimitedCommitteeSecurity().description,
    // We need the `-` because the higher the probability the worse outcome
    orderHint: -probabilityOfCompromise(
      params.requiredMembers,
      params.membersCount,
    ),
  }
}

function getDacSentiment(params: {
  membersCount: number
  requiredMembers: number
  knownMembers: DacInfo['knownMembers']
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

/**
 * This function approximates the probability of a compromise in a DAC.
 * With the assumption that the probability of a single member being compromised is 1%.
 */
export function probabilityOfCompromise(required: number, total: number) {
  const combinations = getCombinations(total, required)
  return combinations * 0.01 ** required
}

function getCombinations(total: number, required: number) {
  if (required > total || required < 0) {
    return 0
  }
  return factorial(total) / (factorial(required) * factorial(total - required))
}

function factorial(num: number): number {
  if (num > 15) {
    throw new Error(`Factorial will loose accuracy with large numbers: ${num}!`)
  }

  if (num < 0) {
    return -1
  }
  let factorial = 1
  for (let n = 1; n <= num; n++) {
    factorial *= n
  }
  return factorial
}

export const DaCommitteeSecurityRisk = {
  RobustAndDiverseCommittee,
  LimitedCommitteeSecurity,
  NoCommitteeSecurity,
  NoDiversityCommitteeSecurity,
  NoHonestMinimumCommitteeSecurity,
  AutoDAC,
}
