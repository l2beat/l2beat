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
        negative: 'Not enough data is posted to L1.',
      },
      rollupNodeExists: {
        positive: 'There exists a rollup node for the project.',
        negative: 'There is no rollup node for the project.',
      },
      nodeSoftwareProgram: {
        positive: 'The rollup node is a software program.',
        negative: 'The rollup node is not a software program.',
      },
      nodeOpenSource: {
        positive: 'The rollup node is open source.',
        negative: 'The rollup node is not open source.',
      },
      nodeComputesStateBasedOnL1: {
        positive: 'Computes the L2 state based on Ethereum L1 data.',
        negative: 'Computes the L2 state not based on Ethereum L1 data.',
      },
      nodeDetectsDisagreement: {
        positive: 'Detects when L2 state disagrees with Ethereum L1.',
        negative: 'Does not detect when L2 state disagrees with Ethereum L1.',
      },
    },
  },
  stage1: {
    name: 'Stage 1',
    items: {
      stateVerificationOnL1: {
        positive: 'The project uses a fraud proof or validity proof system.',
        negative: 'The project does not verify the L2 state on L1.',
      },
      fraudProofSystemWhitelistedOutsideOrganization: {
        positive:
          'There is a whitelist of validators, but they come from outside the organization.',
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
          'Users have time to exit the system because the upgrade delay is longer than the fraud proof window.',
        negative:
          'Users do not have time to exit the system because the upgrade delay is shorter than the fraud proof window.',
      },
      usersCanExitWithoutCooperation: {
        positive:
          'Users can exit the system without cooperation from Operators.',
        negative:
          'Users cannot exit the system without cooperation from Operators.',
      },
      securityCouncilMultisig: {
        positive: 'The security council is an onchain multisig.',
        negative: 'The security council is not an onchain multisig.',
      },
      securityCouncilAtLeast8: {
        positive: 'The security council has at least 8 members.',
        negative: 'The security council has less than 8 members.',
      },
      securityCouncilMultisigThreshold: {
        positive: 'Requires at least 75% threshold for reaching consensus.',
        negative: 'Requires less than 75% threshold for reaching consensus.',
      },
      securityCouncilMembersOutsideOrganization: {
        positive:
          'At least 50% of the security council members are from outside the organization.',
        negative:
          'Less than 50% of the security council members are from outside the organization.',
      },
      securityCouncilMembersOutsideOrganizationPseudonymous: {
        positive:
          'The outside members are publicly known, but can be pseudonymous.',
        negative: 'The outside members are not publicly known.',
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
