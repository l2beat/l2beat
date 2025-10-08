import { type ChecklistTemplate, createGetStage, isSatisfied } from './stage'

interface GetStageOptions {
  rollupNodeLink?: string
  securityCouncilReference?: string
  stage1PrincipleDescription?: string
  additionalConsiderations?: {
    short: string
    long: string
  }
}
type Blueprint = ReturnType<typeof getBlueprint>
type BlueprintChecklist = ChecklistTemplate<Blueprint>

export const getStage = (
  blueprintChecklist: BlueprintChecklist,
  opts?: GetStageOptions,
) => {
  const rollupNode = isSatisfied(
    blueprintChecklist.stage0.rollupNodeSourceAvailable,
  )
  if (rollupNode === true && !opts?.rollupNodeLink) {
    throw new Error('Rollup node link is required')
  }

  const blueprint = getBlueprint(opts)

  return {
    ...createGetStage(blueprint)(blueprintChecklist),
    additionalConsiderations: opts?.additionalConsiderations,
    stage1PrincipleDescription: opts?.stage1PrincipleDescription,
  }
}

const getBlueprint = (opts?: GetStageOptions) =>
  ({
    stage0: {
      name: 'Stage 0',
      items: {
        stateVerificationOnL1: {
          positive: 'A complete and functional proof system is deployed.',
          negative: 'The proof system is still under development.',
        },
        fraudProofSystemAtLeast5Outsiders: {
          positive:
            'There are at least 5 external actors who can submit fraud proofs.',
          negative: 'Fraud proof submission is not sufficiently decentralized.',
        },
        callsItselfRollup: {
          positive: 'The project calls itself a rollup.',
          negative: "The project doesn't call itself a rollup.",
        },
        stateRootsPostedToL1: {
          positive: 'State roots are posted to Ethereum L1.',
          negative: 'State roots are not posted to Ethereum L1.',
        },
        dataAvailabilityOnL1: {
          positive:
            'Inputs for the state transition function are posted to Ethereum L1.',
          negative:
            'All the data to reconstruct the L2 state is not available on Ethereum L1.',
        },
        rollupNodeSourceAvailable: {
          positive:
            'A source-available node exists that can recreate the state from Ethereum L1 data. Please note that the L2BEAT team has not verified the validity of the node source code.' +
            (opts?.rollupNodeLink
              ? ` [View code](${opts.rollupNodeLink})`
              : ''),
          negative:
            'No source-available node exists that can recreate the state from L1 data.',
          underReviewMessage:
            'The requirement for available node software is under review',
          warningMessage:
            'There is no available node software that can reconstruct the state from L1 data, hence there is no way to verify that this system is a rollup.',
        },
      },
    },
    stage1: {
      name: 'Stage 1',
      principle: {
        positive:
          'Compromising ≥75% of the Security Council is the only way (other than bugs) for a rollup to indefinitely block an L2→L1 message (e.g. a withdrawal) or push an invalid L2→L1 message (e.g. an invalid withdrawal) with a <7d exit window.',
        negative:
          'Compromising ≥75% of the Security Council should be the only way (other than bugs) for a rollup to indefinitely block an L2→L1 message (e.g. a withdrawal) or push an invalid L2→L1 message (e.g. an invalid withdrawal) wiith a <7d exit window.',
      },
      items: {
        usersCanExitWithoutCooperation: {
          positive:
            'Users are able to exit without the help of the permissioned operators.',
          negative: `Users' withdrawals can be censored by the permissioned operators.`,
        },
        usersHave7DaysToExit: {
          positive:
            'In case of an unwanted upgrade by actors more centralized than a Security Council, users have at least 7d to exit.',
          negative:
            'Upgrades executed by actors with more centralized control than a Security Council provide less than 7d for users to exit if the permissioned operator is down or censoring.',
        },
        securityCouncilProperlySetUp: {
          positive:
            'The Security Council is properly set up' +
            (opts?.securityCouncilReference
              ? ` [(List of members)](${opts.securityCouncilReference}).`
              : '.'),
          negative: 'The Security Council is not properly set up.',
        },
      },
    },
    stage2: {
      name: 'Stage 2',
      items: {
        fraudProofSystemIsPermissionless: {
          positive: 'Fraud proof submission is open to everyone.',
          negative:
            'Fraud proof submission is open only to whitelisted actors.',
        },
        delayWith30DExitWindow: {
          positive:
            'Upgrades unrelated to onchain provable bugs provide at least 30d to exit.',
          negative:
            'Upgrades unrelated to onchain provable bugs provide less than 30d to exit.',
        },
        proofSystemOverriddenOnlyInCaseOfABug: {
          positive:
            'The Security Council is limited to acting solely on onchain provable bugs.',
          negative: `The Security Council's actions are not confined to onchain provable bugs.`,
        },
      },
    },
  }) as const
