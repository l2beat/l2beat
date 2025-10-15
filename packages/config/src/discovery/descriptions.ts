import type { Permission, RolePermissionEntries } from '@l2beat/discovery'

export const UltimatePermissionToPrefix: {
  [key in Permission]: string | undefined
} = {
  interact: 'Is allowed to interact with',
  upgrade: 'Can upgrade the implementation of',
  act: undefined,
  guard: 'A Guardian',
  challenge: 'A Challenger',
  propose: 'A Proposer',
  sequence: 'A Sequencer',
  validate: 'A Validator',
  disperse: 'A Disperser',
  relayDA: 'A DA Relayer',
  operateLinea: 'An Operator',
  fastconfirm: 'A FastConfirmer',
  validateZkStack: 'A Validator',
  relay: 'A Relayer',
  validateBridge: 'A Validator',
  validateBridge2: 'A Validator',
  validateBridge3: 'A Validator',
  aggregatePolygon: 'A trusted Aggregator',
  operateStarknet: 'An Operator',
  operateStarkEx: 'An Operator',
  governStarknet: 'A Governor',
  member: 'Is a member of',
  metisGameCreator: 'A dispute game creator',
  stateDeleterMetis: 'A state deleter',
  hotValidatorHyperliquid: 'A Hot Validator',
  coldValidatorHyperliquid: 'A Cold Validator',
  acrossPropose: 'A Proposer',
  validateLighter: 'A Validator',
}

export const RoleDescriptions: {
  [key in (typeof RolePermissionEntries)[number]]: {
    name: string
    description: string
  }
} = {
  sequence: {
    name: 'Sequencer',
    description:
      'Allowed to commit transactions from the current layer to the host chain.',
  },
  propose: {
    name: 'Proposer',
    description:
      'Allowed to post new state roots of the current layer to the host chain.',
  },
  challenge: {
    name: 'Challenger',
    description:
      'Allowed to challenge or delete state roots proposed by a Proposer.',
  },
  guard: {
    name: 'Guardian',
    description:
      'Allowed to pause withdrawals. In op stack systems with a proof system, the Guardian can also blacklist dispute games and set the respected game type (permissioned / permissionless).',
  },
  validate: {
    // ORBIT specific
    name: 'Validator',
    description:
      'Orbit stack specific Proposer and Challenger role. Can propose new state roots (called nodes) and challenge state roots on the host chain.',
  },
  operateLinea: {
    // LINEA specific
    name: 'Operator',
    description:
      'Allowed to prove blocks and post the corresponding transaction data.',
  },
  fastconfirm: {
    name: 'AnyTrust FastConfirmer',
    description:
      'Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root.',
  },
  validateZkStack: {
    // ZK stack specific
    name: 'Validator',
    description:
      'Permissioned to call the functions to commit, prove, execute and revert L2 batches through the ValidatorTimelock in the main Diamond contract.',
  },
  validateBridge: {
    name: 'Validator',
    description:
      'Permissioned to sign messages (state roots) encoding transfer information or governance actions such as updates to a new validator set, which are decoded onchain with signature checks.',
  },
  validateBridge2: {
    name: 'Validator',
    description:
      'Permissioned to sign crosschain messages encoding transfer information, which are decoded onchain with signature checks. The validators listed here are the default validators for Ethereum and can be overridden by a custom configuration.',
  },
  validateBridge3: {
    name: 'Validator',
    description:
      'Permissioned to sign crosschain messages, attesting to their validity.',
  },
  relay: {
    name: 'Relayer',
    description:
      'Permissioned to relay messages that are then verified onchain.',
  },
  aggregatePolygon: {
    name: 'Trusted Aggregator (Proposer)',
    description:
      'Permissioned to post new state roots and global exit roots accompanied by ZK proofs.', // and accounting proofs for CDK sovereign (others) chains
  },
  operateStarknet: {
    name: 'Operator',
    description:
      'Permissioned to regularly update the state of the L2 on L1. Each state update must have been proven via the SHARP verifier and contains state diffs for data availability.',
  },
  operateStarkEx: {
    name: 'Operator',
    description:
      'Permissioned to regularly update the state roots of the L2 on L1. Each state update must have been proven via the SHARP verifier and contains commitments to the data that is itself kept offchain.',
  },
  governStarknet: {
    name: 'Governor',
    description:
      'Permissioned to manage the Operator role, finalize state and change critical parameters like the programHash, configHash, or message cancellation delay in the core contract.',
  },
  metisGameCreator: {
    name: 'Game Creator',
    description: 'Can create new dispute games.',
  },
  disperse: {
    name: 'Disperser',
    description: 'Can disperse EigenDA blobs to the EigenDA node operators.',
  },
  relayDA: {
    name: 'Relayer',
    description:
      'Can store and serve both unencoded blobs as well as encoded chunks.',
  },
  stateDeleterMetis: {
    name: 'State Deleter',
    description:
      'Can delete any state root from the StateCommitmentChain, preventing withdrawals based on that root.',
  },
  hotValidatorHyperliquid: {
    name: 'Hot Validator',
    description:
      'Can request withdrawals, start a validator set change, add lockers and finalizers (Can also change cold validators by adding a finalizer and proposing/finalizing a new validator set).',
  },
  coldValidatorHyperliquid: {
    name: 'Cold Validator',
    description:
      'Can change the dispute period, block duration and locker threshold. Can also invalidate withdrawals, emergencyUnlock (unpause and change the validator set), remove lockers and finalizers.',
  },
  acrossPropose: {
    name: 'Proposer',
    description:
      'Can propose new root bundles (containing settlement info to refund relayers), which are validated optimistically by the UMA oracle.',
  },
  validateLighter: {
    name: 'Validator',
    description:
      'Permissioned to call the functions to commit, prove or revert unproven L2 transaction batches on L1.',
  },
}
