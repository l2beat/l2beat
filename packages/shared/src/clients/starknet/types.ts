import { HEX_REGEX } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

export interface StarknetCallParameters {
  contract_address: string
  entry_point_selector: string
  calldata: string[]
}

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

export type StarknetErrorResponse = v.infer<typeof StarknetErrorResponse>
export const StarknetErrorResponse = v.object({
  jsonrpc: v.literal('2.0'),
  error: v.object({
    code: v.number().check(Number.isInteger),
    message: v.string(),
  }),
})
