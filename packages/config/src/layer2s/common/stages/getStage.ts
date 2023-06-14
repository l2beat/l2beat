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
        positive: 'Inputs for the state transition function are posted to L1.',
        negative:
          'Inputs for the state transition function are not posted to L1.',
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
          'In case of an unwanted upgrade by actors more centralized than a Security Council, users have at least 14d to exit.',
        negative:
          'Upgrades executed by actors with more centralized control than a Security Council provide less than 14 days for user exit.',
      },
      usersCanExitWithoutCooperation: {
        positive: `Users are able to exit without the help of the permissioned operators.`,
        negative: `Users' withdrawals can be censored by the permissioned operators.`,
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
          'The Security Council is limited to acting solely on adjudicable soundness errors.',
        negative: `The Security Council's actions are not confined to adjudicable soundness errors.`,
      },
      fraudProofSystemIsPermissionless: {
        positive: 'Fraud proof submission is open to everyone.',
        negative: 'Fraud proof submission is open only to whitelisted actors.',
      },
      delayWith30DExitWindow: {
        positive:
          'In case of an unwanted upgrade by actors more centralized than a Security Council, users have at least 30d to exit.',
        negative:
          'Upgrades executed by actors more centralized than a Security Council provide less than 30d to exit following an unwanted upgrade.',
      },
    },
  },
})
