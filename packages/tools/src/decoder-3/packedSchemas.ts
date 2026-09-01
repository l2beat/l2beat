import type { PackedSchema } from './packed'

// Mirrors the fixed-width abi.encodePacked layouts in op-contracts' LibGameArgs.
const COMMON_GAME_ARGS_FIELDS = [
  { name: 'absolutePrestate', type: 'bytes32' },
  { name: 'vm', type: 'address' },
  { name: 'anchorStateRegistry', type: 'address' },
  { name: 'weth', type: 'address' },
  { name: 'l2ChainId', type: 'uint256' },
] as const

export const OP_PERMISSIONLESS_GAME_ARGS_SCHEMA: PackedSchema = {
  name: 'OP permissionless game args',
  fields: COMMON_GAME_ARGS_FIELDS,
}

export const OP_PERMISSIONED_GAME_ARGS_SCHEMA: PackedSchema = {
  name: 'OP permissioned game args',
  fields: [
    ...COMMON_GAME_ARGS_FIELDS,
    { name: 'proposer', type: 'address' },
    { name: 'challenger', type: 'address' },
  ],
}

export const OP_SUPER_PERMISSIONED_GAME_ARGS_SCHEMA: PackedSchema = {
  name: 'OP super permissioned game args',
  fields: [
    { name: 'anchorStateRegistry', type: 'address' },
    { name: 'proposer', type: 'address' },
  ],
}

export const OP_ZK_GAME_ARGS_SCHEMA: PackedSchema = {
  name: 'OP ZK game args',
  fields: [
    { name: 'absolutePrestate', type: 'bytes32' },
    { name: 'verifier', type: 'address' },
    { name: 'maxChallengeDuration', type: 'uint64' },
    { name: 'maxProveDuration', type: 'uint64' },
    { name: 'challengerBond', type: 'uint256' },
    { name: 'anchorStateRegistry', type: 'address' },
    { name: 'weth', type: 'address' },
    { name: 'l2ChainId', type: 'uint256' },
  ],
}
