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
        },
        stage1: {
          stateVerificationOnL1: true,
          fraudProofSystemAtLeast5Outsiders: true,
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
      },
    )
    expect(result).toEqual({
      message: undefined,
      missing: {
        nextStage: 'Stage 2',
        requirements: [
          'Fraud proof submission is open only to whitelisted actors.',
          'Upgrades unrelated to on-chain provable bugs provide less than 30d to exit.',
          "The Security Council's actions are not confined to on-chain provable bugs.",
        ],
      },
      stage: 'Stage 1',
      summary: [
        {
          requirements: [
            {
              description: 'The project calls itself a rollup.',
              satisfied: true,
            },
            {
              description: 'L2 state roots are posted to Ethereum L1.',
              satisfied: true,
            },
            {
              description:
                'Inputs for the state transition function are posted to L1.',
              satisfied: true,
            },
            {
              description:
                'A source-available node exists that can recreate the state from L1 data. [View code](randomlink)',
              satisfied: true,
            },
          ],
          stage: 'Stage 0',
        },
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
                'Upgrades unrelated to on-chain provable bugs provide less than 30d to exit.',
              satisfied: false,
            },
            {
              description:
                "The Security Council's actions are not confined to on-chain provable bugs.",
              satisfied: false,
            },
          ],
          stage: 'Stage 2',
        },
      ],
    })
  })

  it('should throw error if no rollup node link is present and rollupNodeSourceAvailable is satisifed', () => {
    expect(() =>
      getStage({
        stage0: {
          callsItselfRollup: true,
          stateRootsPostedToL1: true,
          dataAvailabilityOnL1: true,
          rollupNodeSourceAvailable: true,
        },
        stage1: {
          stateVerificationOnL1: true,
          fraudProofSystemAtLeast5Outsiders: true,
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
