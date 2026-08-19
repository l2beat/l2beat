import { HEX_REGEX } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

export interface StarknetCallParameters {
  contract_address: string
  entry_point_selector: string
  calldata: string[]
}

export interface StarknetEvent {
  block_number: number
  transaction_hash: string
  event_index: number
  keys: string[]
  data: string[]
}

export const StarknetGetEventsResponse = v.object({
  jsonrpc: v.literal('2.0'),
  id: v.number().check(Number.isInteger),
  result: v.object({
    events: v.array(
      v.object({
        block_number: v.number().check(Number.isInteger),
        transaction_hash: v.string(),
        event_index: v.number().check(Number.isInteger).optional(),
        keys: v.array(v.string().check((v) => HEX_REGEX.test(v))),
        data: v.array(v.string().check((v) => HEX_REGEX.test(v))),
      }),
    ),
    continuation_token: v.union([v.string(), v.null()]).optional(),
  }),
})

export type StarknetGetBlockResponse = v.infer<typeof StarknetGetBlockResponse>
export const StarknetGetBlockResponse = v.object({
  jsonrpc: v.literal('2.0'),
  id: v.number().check(Number.isInteger),
  result: v.object({
    block_number: v.number().check(Number.isInteger),
    timestamp: v.number().check(Number.isInteger),
    transactions: v.array(v.string()),
  }),
})

export type StarknetTransaction = v.infer<typeof StarknetTransaction>
/**
 * Starknet transaction schema with optional fields to handle Paradex bug.
 * Paradex returns empty/malformed transactions with missing transaction_hash
 * and empty string fields. These are filtered out in StarknetClient.
 */
const StarknetTransaction = v.object({
  type: v.string(),
  calldata: v.array(v.string()).optional(),
  /** Optional to allow parsing Paradex empty transactions (filtered later) */
  transaction_hash: v.string().optional(),
  sender_address: v.string().optional(),
})

export type StarknetGetBlockWithTxsResponse = v.infer<
  typeof StarknetGetBlockWithTxsResponse
>
export const StarknetGetBlockWithTxsResponse = v.object({
  jsonrpc: v.literal('2.0'),
  id: v.number().check(Number.isInteger),
  result: v.object({
    block_number: v.number().check(Number.isInteger),
    timestamp: v.number().check(Number.isInteger),
    block_hash: v.string(),
    transactions: v.array(StarknetTransaction),
  }),
})

export type StarknetCallResponse = v.infer<typeof StarknetCallResponse>
export const StarknetCallResponse = v.object({
  jsonrpc: v.literal('2.0'),
  id: v.number().check(Number.isInteger),
  result: v.array(
    v.string().check((v) => HEX_REGEX.test(v), 'Invalid hex string'),
  ),
})

export type StarknetClassHashResponse = v.infer<
  typeof StarknetClassHashResponse
>
export const StarknetClassHashResponse = v.object({
  jsonrpc: v.literal('2.0'),
  result: v.string().check((v) => HEX_REGEX.test(v), 'Invalid hex string'),
})

export type StarknetContractClass = v.infer<typeof StarknetContractClass>
export const StarknetContractClass = v.object({
  /**
   * Sierra classes carry the ABI as a JSON-encoded string;
   * some gateways return it pre-parsed as an array.
   * Legacy (Cairo 0) classes may omit it.
   */
  abi: v.union([v.string(), v.array(v.unknown())]).optional(),
  contract_class_version: v.string().optional(),
})

export type StarknetClassResponse = v.infer<typeof StarknetClassResponse>
export const StarknetClassResponse = v.object({
  jsonrpc: v.literal('2.0'),
  result: StarknetContractClass,
})

export type StarknetStorageResponse = v.infer<typeof StarknetStorageResponse>
export const StarknetStorageResponse = v.object({
  jsonrpc: v.literal('2.0'),
  result: v.string().check((v) => HEX_REGEX.test(v), 'Invalid hex string'),
})

/** https://github.com/starkware-libs/starknet-specs JSON-RPC error codes */
export const STARKNET_ERROR_CODES = {
  CONTRACT_NOT_FOUND: 20,
  ENTRYPOINT_NOT_FOUND: 21,
  CLASS_HASH_NOT_FOUND: 28,
  CONTRACT_ERROR: 40,
} as const

export type StarknetErrorResponse = v.infer<typeof StarknetErrorResponse>
export const StarknetErrorResponse = v.object({
  jsonrpc: v.literal('2.0'),
  error: v.object({
    code: v.number().check(Number.isInteger),
    message: v.string(),
  }),
})
