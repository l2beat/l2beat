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
      txsOrStateDiffsPostedToL1: {
        positive: 'L2 transactions or L2 state diffs are posted to L1.',
        negative: 'No data is posted to L1.',
      },
      rollupNodeExists: {
        positive: 'There exists a rollup node for the project.',
        negative: 'There is no rollup node for the project.',
      },
    },
  },
  stage1: {
    name: 'Stage 1',
    items: {
      stateVerificationOnL1: {
        positive: 'The project uses a fraud proof or validity proof system.',
        negative: 'The project does not verify L2 state on L1.',
      },
      fraudProofSystemWhitelistedOutsideOrganization: {
        positive:
          'There is a whitelist of validators, but they come outside the organization.',
        negative:
          'All validators from the whitelist are from the organization.',
      },
      fraudProofSystemAllowsRejecting: {
        positive:
          'Fraud proof system allows for rejecting proposed state roots.',
        negative:
          'Fraud proof system does not allow for rejecting proposed state roots.',
      },
      validityProofRequiresAccepting: {
        positive:
          'Validity proof is required for accepting proposed state roots.',
        negative:
          'Validity proof is not required for accepting proposed state roots.',
      },
      validityProofChecksTransactions: {
        positive:
          'The proof system checks the validity of transactions used to construct the state diffs.',
        negative:
          'The proof system does not check the validity of transactions used to construct the state diffs.',
      },
      proofSystemOverriddenOnlyBySecurityCouncil: {
        positive:
          'Proof system can only be overridden by the security council.',
        negative:
          'Proof system can be overridden by actors other than the Security Council.',
      },
      upgradeCannotInterveneInProofSystem: {
        positive: 'The upgrade mechanism cannot intervene in the proof system.',
        negative: 'The upgrade mechanism can intervene in the proof system.',
      },
      upgradeDelayLongerThenFraudProofWindow: {
        positive:
          'User have time to exit the system because the upgrade delay is longer than the fraud proof window.',
        negative:
          'Users do not have time to exit the system because the upgrade delay is shorter than the fraud proof window.',
      },
      usersCanExitWithoutCooperation: {
        positive:
          'Users can exit the system without cooperation from Operators.',
        negative:
          'Users cannot exit the system without cooperation from Operators.',
      },
      isSecurityCouncil: {
        positive: 'The project has Security Council passing the requirements.',
        negative:
          'The project does not have Security Council passing the requirements.',
      },
    },
  },
  stage2: {
    name: 'Stage 2',
    items: {
      proofSystemOverridenOnlyInCaseOfABug: {
        positive:
          'Proof system can only be overridden if a bug is detected by the Ethereum L1 contracts.',
        negative:
          'Proof system can be overridden for reasons other than a bug detected by the Ethereum L1 contracts.',
      },
      fraudProofSystemMustBePermissionless: {
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
