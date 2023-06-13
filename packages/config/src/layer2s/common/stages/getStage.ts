import { createGetStage } from './stage'

export type StageChecklist = Parameters<typeof getStage>[0]

export const getStage = createGetStage({
  stage0: {
    name: 'Stage 0',
    items: {
      callsItselfRollup: {
        positive: 'The project calls itself a rollup.',
        negative: "The project doesn't call itself a rollup.",
      },
      stateRootsPostedToL1: {
        positive: 'L2 state roots are posted to Ethereum L1.',
        negative: 'L2 state roots are not posted to Ethereum L1.',
      },
      dataAvailabilityOnL1: {
        positive: 'Inputs for state transition function are posted to L1.',
        negative: 'Inputs for state transition function are not posted to L1.',
      },
      rollupNodeOpenSource: {
        positive: 'The rollup node software is open source.',
        negative: 'The rollup node software is not open source.',
      },
    },
  },
  stage1: {
    name: 'Stage 1',
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
      usersHave14DaysToExit: {
        positive:
          'Users have at least 14 days to exit the system in case of unwanted upgrades',
        negative:
          'Users do not have at least 14 days to exit the system in case of unwanted upgrades',
      },
      usersCanExitWithoutCooperation: {
        positive: `Withdrawals cannot be censored by the permissioned operators.`,
        negative: `Withdrawals can be censored by the permissioned operators.`,
      },
      securityCouncilProperlySetUp: {
        positive: 'The Security Council is properly set up.',
        negative: 'The Security Council is not properly set up.',
      },
    },
  },
  stage2: {
    name: 'Stage 2',
    items: {
      proofSystemOverriddenOnlyInCaseOfABug: {
        positive:
          'Proof system can be overridden only if a bug is detected by the Ethereum L1 contracts.',
        negative:
          'Proof system can be overridden for reasons other than a bug detected by the Ethereum L1 contracts.',
      },
      fraudProofSystemIsPermissionless: {
        positive: 'The fraud proof system is permissionless.',
        negative: 'The fraud proof system is permissioned.',
      },
      delayWith30DExitWindow: {
        positive: 'Users have at least 30 days to exit the system.',
        negative: 'Users have less than 30 days to exit the system.',
      },
    },
  },
})
