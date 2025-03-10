import type { Permission, RolePermissionEntries } from '@l2beat/discovery'

export const DirectPermissionToPrefix: {
  [key in Permission]: string | undefined
} = {
  interact: 'Can be used to interact with',
  upgrade: 'Can be used to upgrade implementation of',
  act: 'Can act on behalf of',
  guard: 'Can act as a Guardian',
  challenge: 'Can act as a Challenger',
  propose: 'Can act as a Proposer',
  sequence: 'Can act as a Sequencer',
  validate: 'Can act as a Validator',
  operateLinea: 'Can act as an Operator',
  fastconfirm: 'Can act as a FastConfirmer',
  validateZkStack: 'Can act as a Validator',
  relay: 'Can act as a Relayer',
  validateBridge: 'Can act as a Validator',
  validateBridge2: 'Can act as a Validator',
  aggregatePolygon: 'Can act as a trusted Aggregator',
  operateStarknet: 'Can act as an Operator',
  governStarknet: 'Can act as a Governor',
  member: 'Is a member of',
  secAgentACStarknetETHBridge: 'Can act as a Security Agent',
  secAgentACStarknetERC20Bridge: 'Can act as a Security Agent',
  secAdminACStarknetETHBridge: 'Can act as a Security Admin',
  secAdminACStarknetERC20Bridge: 'Can act as a Security Admin',
  govAdminACStarknetETHBridge: 'Can act as a Governance Admin',
  govAdminACStarknetERC20Bridge: 'Can act as a Governance Admin',
  secAgentACStarknetMultibridge: 'Can act as a Security Agent',
  secAdminACStarknetMultibridge: 'Can act as a Security Admin',
  govAdminACStarknetMultibridge: 'Can act as a Governance Admin',
  managerStarknetMultibridge: 'Can act as a Manager',
  upgraderStarknetETHBridge: 'Can act as an Upgrader',
  upgraderStarknet: 'Can act as an Upgrader',
}

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
  operateLinea: 'An Operator',
  fastconfirm: 'A FastConfirmer',
  validateZkStack: 'A Validator',
  relay: 'A Relayer',
  validateBridge: 'A Validator',
  validateBridge2: 'A Validator',
  aggregatePolygon: 'A trusted Aggregator',
  operateStarknet: 'An Operator',
  governStarknet: 'A Governor',
  member: 'Is a member of',
  secAgentACStarknetETHBridge: 'A Security Agent',
  secAgentACStarknetERC20Bridge: 'A Security Agent',
  secAdminACStarknetETHBridge: 'A Security Admin',
  secAdminACStarknetERC20Bridge: 'A Security Admin',
  govAdminACStarknetETHBridge: 'A Governance Admin',
  govAdminACStarknetERC20Bridge: 'A Governance Admin',
  secAgentACStarknetMultibridge: 'A Security Agent',
  secAdminACStarknetMultibridge: 'A Security Admin',
  govAdminACStarknetMultibridge: 'A Governance Admin',
  managerStarknetMultibridge: 'A Manager',
  upgraderStarknetETHBridge: 'An Upgrader',
  upgraderStarknet: 'An Upgrader',
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
    description: 'Allowed to pause deposits and withdrawals.',
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
      'Permissoned to sign messages (state roots) encoding transfer information or governance actions such as updates to a new validator set, which are decoded onchain with signature checks.',
  },
  validateBridge2: {
    name: 'Validator',
    description:
      'Permissoned to sign crosschain messages encoding transfer information, which are decoded onchain with signature checks. The validators listed here are the default validators for Ethereum and can be overridden by a custom configuration.',
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
      'Permissioned to regularly update and prove the state of the L2 on L1.',
  },
  governStarknet: {
    name: 'Governor',
    description:
      'Permissioned to manage the Operator role, finalize state and change critical parameters like the programHash, configHash, or message cancellation delay in the core contract.',
  },
  // test roles
  secAgentACStarknetETHBridge: {
    name: 'Security Agent (ETH Bridge)',
    description:
      'Permissioned to enable the withdrawal limit on the Starknet ETH bridge.',
  },
  secAgentACStarknetERC20Bridge: {
    name: 'Security Agent (ERC-20 Bridges)',
    description:
      'Permissioned to enable the withdrawal limit on some Starknet token bridges.',
  },
  secAdminACStarknetETHBridge: {
    name: 'Security Admin (ETH Bridge)',
    description:
      'Permissioned to disable the withdrawal limit on the Starknet ETH bridge.',
  },
  secAdminACStarknetERC20Bridge: {
    name: 'Security Admin (ERC-20 Bridges)',
    description:
      'Permissioned to disable the withdrawal limit on some Starknet token bridges.',
  },
  govAdminACStarknetETHBridge: {
    name: 'Security Admin (ETH Bridge)',
    description:
      'Permissioned to manage critical access control roles related to upgrades and set the proxy governor that can upgrade the implementation.',
  },
  govAdminACStarknetERC20Bridge: {
    name: 'Security Admin (ERC-20 Bridges)',
    description:
      'Permissioned to manage critical access control roles related to upgrades and set the proxy governor that can upgrade the implementation.',
  },
  secAgentACStarknetMultibridge: {
    name: 'Security Agent (Multibridge)',
    description:
      'Permissioned to enable the withdrawal limit on the Starknet Multibridge.',
  },
  secAdminACStarknetMultibridge: {
    name: 'Security Admin (Multibridge)',
    description:
      'Permissioned to disable the withdrawal limit on the Starknet Multibridge.',
  },
  govAdminACStarknetMultibridge: {
    name: 'Security Admin (Multibridge)',
    description:
      'Permissioned to manage critical access control roles related to upgrades and set the proxy governor that can upgrade the implementation.',
  },
  managerStarknetMultibridge: {
    name: 'Manager (Multibridge)',
    description:
      'Permissioned to enroll new tokens or deactivate deposits into the escrow (for each token individually).',
  },
  upgraderStarknetETHBridge: {
    name: 'Upgrader (ETH Bridge)',
    description:
      'Permissioned to upgrade the Starknet ETH bridge (and most other bridge escrows).',
  },
  upgraderStarknet: {
    name: 'Upgrader (Core contract)',
    description: 'Permissioned to upgrade the Starknet core contract.',
  },
}
