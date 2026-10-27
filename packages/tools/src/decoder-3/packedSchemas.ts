import type { DecodedValue } from './decode'
import { decodePacked, type PackedSchema, packedSchemaSize } from './packed'

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
  ],
}

// Each LibGameArgs layout has its own length, so the length picks the layout.
const OP_GAME_ARGS_SCHEMAS = [
  OP_SUPER_PERMISSIONED_GAME_ARGS_SCHEMA,
  OP_PERMISSIONLESS_GAME_ARGS_SCHEMA,
  OP_ZK_GAME_ARGS_SCHEMA,
  OP_PERMISSIONED_GAME_ARGS_SCHEMA,
]

// GameTypes in op-contracts' Types.sol and the layout their games read.
const OP_GAME_TYPES: Record<string, { name: string; schema?: PackedSchema }> = {
  '0': { name: 'CANNON', schema: OP_PERMISSIONLESS_GAME_ARGS_SCHEMA },
  '1': {
    name: 'PERMISSIONED_CANNON',
    schema: OP_PERMISSIONED_GAME_ARGS_SCHEMA,
  },
  '2': { name: 'ASTERISC', schema: OP_PERMISSIONLESS_GAME_ARGS_SCHEMA },
  '3': { name: 'ASTERISC_KONA', schema: OP_PERMISSIONLESS_GAME_ARGS_SCHEMA },
  '4': { name: 'SUPER_CANNON', schema: OP_PERMISSIONLESS_GAME_ARGS_SCHEMA },
  '5': {
    name: 'SUPER_PERMISSIONED',
    schema: OP_SUPER_PERMISSIONED_GAME_ARGS_SCHEMA,
  },
  '6': { name: 'OP_SUCCINCT' },
  '7': {
    name: 'SUPER_ASTERISC_KONA',
    schema: OP_PERMISSIONLESS_GAME_ARGS_SCHEMA,
  },
  '8': { name: 'CANNON_KONA', schema: OP_PERMISSIONLESS_GAME_ARGS_SCHEMA },
  '9': {
    name: 'SUPER_CANNON_KONA',
    schema: OP_PERMISSIONLESS_GAME_ARGS_SCHEMA,
  },
  '10': { name: 'ZK_DISPUTE_GAME', schema: OP_ZK_GAME_ARGS_SCHEMA },
  '254': { name: 'FAST' },
  '255': { name: 'ALPHABET' },
  '1337': { name: 'KAILUA' },
}

export function decodeGameArgs(
  gameType: string,
  encoded: `0x${string}`,
  chainId?: number,
): DecodedValue | undefined {
  const length = (encoded.length - 2) / 2
  const schema = OP_GAME_ARGS_SCHEMAS.find(
    (schema) => packedSchemaSize(schema) === length,
  )
  if (!schema) return

  const decoded = decodePacked(schema, encoded, chainId)
  const known = OP_GAME_TYPES[gameType]
  const layout = `${schema.name}, ${length} B`
  if (known?.schema === schema) {
    decoded.note = { text: `${layout}, as ${known.name} expects` }
  } else if (known?.schema) {
    decoded.note = {
      text: `${layout}, but ${known.name} expects ${known.schema.name}`,
      warning: true,
    }
  } else {
    decoded.note = {
      text: `${layout}, chosen by length: game type ${gameType}${known ? ` (${known.name})` : ''} has no LibGameArgs layout`,
      warning: true,
    }
  }
  return decoded
}
