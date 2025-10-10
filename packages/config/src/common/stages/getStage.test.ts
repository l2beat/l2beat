import { expect } from 'earl'

import { getStage } from './getStage'

describe(getStage.name, () => {
  it('should return stage object', () => {
    const result = getStage(
      {
        stage0: {
          callsItselfRollup: true,
          stateRootsPostedToL1: true,
          dataAvailabilityOnL1: true,
          rollupNodeSourceAvailable: true,
          stateVerificationOnL1: true,
          fraudProofSystemAtLeast5Outsiders: true,
        },
        stage1: {
          principle: true,
          usersHave7DaysToExit: true,
          usersCanExitWithoutCooperation: true,
          securityCouncilProperlySetUp: true,
        },
        stage2: {
          proofSystemOverriddenOnlyInCaseOfABug: false,
          fraudProofSystemIsPermissionless: false,
          delayWith30DExitWindow: false,
        },
      },
      {
        rollupNodeLink: 'randomlink',
        additionalConsiderations: {
          short: 'short notice',
          long: 'long notice',
        },
      },
    )
    expect(result).toEqual({
      message: undefined,
      additionalConsiderations: {
        short: 'short notice',
        long: 'long notice',
      },
      stage1PrincipleDescription: undefined,
      downgradePending: undefined,
      missing: {
        nextStage: 'Stage 2',
        principle: undefined,
        requirements: [
          'Fraud proof submission is open only to whitelisted actors.',
          'Upgrades unrelated to onchain provable bugs provide less than 30d to exit.',
          "The Security Council's actions are not confined to onchain provable bugs.",
        ],
      },
      stage: 'Stage 1',
      summary: [
        {
          requirements: [
            {
              description:
                'A complete and functional proof system is deployed.',
              satisfied: true,
            },
            {
              description:
                'There are at least 5 external actors who can submit fraud proofs.',
              satisfied: true,
            },
            {
              description: 'The project calls itself a rollup.',
              satisfied: true,
            },
            {
              description: 'State roots are posted to Ethereum L1.',
              satisfied: true,
            },
            {
              description:
                'Inputs for the state transition function are posted to Ethereum L1.',
              satisfied: true,
            },
            {
              description:
                'A source-available node exists that can recreate the state from Ethereum L1 data. Please note that the L2BEAT team has not verified the validity of the node source code. [View code](randomlink)',
              satisfied: true,
            },
          ],
          stage: 'Stage 0',
          principle: undefined,
        },
        {
          requirements: [
            {
              description:
                'Users are able to exit without the help of the permissioned operators.',
              satisfied: true,
            },
            {
              description:
                'In case of an unwanted upgrade by actors more centralized than a Security Council, users have at least 7d to exit.',
              satisfied: true,
            },
            {
              description: 'The Security Council is properly set up.',
              satisfied: true,
            },
          ],
          stage: 'Stage 1',
          principle: {
            description:
              'Compromising ≥75% of the Security Council is the only way (other than bugs) for a rollup to indefinitely block an L2→L1 message (e.g. a withdrawal) or push an invalid L2→L1 message (e.g. an invalid withdrawal) with a <7d exit window.',
            satisfied: true,
          },
        },
        {
          requirements: [
            {
              description:
                'Fraud proof submission is open only to whitelisted actors.',
              satisfied: false,
            },
            {
              description:
                'Upgrades unrelated to onchain provable bugs provide less than 30d to exit.',
              satisfied: false,
            },
            {
              description:
                "The Security Council's actions are not confined to onchain provable bugs.",
              satisfied: false,
            },
          ],
          stage: 'Stage 2',
          principle: undefined,
        },
      ],
    })
  })

  it('should throw error if no rollup node link is present and rollupNodeSourceAvailable is satisfied', () => {
    expect(() =>
      getStage({
        stage0: {
          callsItselfRollup: true,
          stateRootsPostedToL1: true,
          dataAvailabilityOnL1: true,
          rollupNodeSourceAvailable: true,
          stateVerificationOnL1: true,
          fraudProofSystemAtLeast5Outsiders: true,
        },
        stage1: {
          principle: true,
          usersHave7DaysToExit: true,
          usersCanExitWithoutCooperation: true,
          securityCouncilProperlySetUp: true,
        },
        stage2: {
          proofSystemOverriddenOnlyInCaseOfABug: false,
          fraudProofSystemIsPermissionless: false,
          delayWith30DExitWindow: false,
        },
      }),
    ).toThrow('Rollup node link is required')
  })
})
