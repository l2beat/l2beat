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
          'All the data to reconstruct the L2 state is not available on L1.',
      },
      rollupNodeOpenSource: {
        positive:
          'An open-source node exists that can recreate the state from L1 data.',
        negative:
          'No open-source node exists that can recreate the state from L1 data.',
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
      usersCanExitWithoutCooperation: {
        positive: `Users are able to exit without the help of the permissioned operators.`,
        negative: `Users' withdrawals can be censored by the permissioned operators.`,
      },
      usersHave7DaysToExit: {
        positive:
          'In case of an unwanted upgrade by actors more centralized than a Security Council, users have at least 7d to exit.',
        negative:
          'Upgrades executed by actors with more centralized control than a Security Council provide less than 7d for users to exit if the permissioned operator is down or censoring.',
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
      fraudProofSystemIsPermissionless: {
        positive: 'Fraud proof submission is open to everyone.',
        negative: 'Fraud proof submission is open only to whitelisted actors.',
      },
      delayWith30DExitWindow: {
        positive:
          'Upgrades unrelated to on-chain provable bugs provide at least 30d to exit.',
        negative:
          'Upgrades unrelated to on-chain provable bugs provide less than 30d to exit.',
      },
      proofSystemOverriddenOnlyInCaseOfABug: {
        positive:
          'The Security Council is limited to acting solely on on-chain provable bugs.',
        negative: `The Security Council's actions are not confined to on-chain provable bugs.`,
      },
    },
  },
})
