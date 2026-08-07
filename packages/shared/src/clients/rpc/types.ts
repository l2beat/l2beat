import {
  assert,
  type Bytes,
  type EthereumAddress,
  HEX_REGEX,
} from '@l2beat/shared-pure'
import { v as z } from '@l2beat/validate'

export const RpcResponse = z.object({ id: z.string(), result: z.unknown() })

export const Quantity = {
  decode: z.string().transform((s) => {
    assert(s.startsWith('0x'), 'Quantity should start with 0x')
    assert(s !== '0x', 'Zero should be represented as 0x0')
    if (s.startsWith('0x0') && s.length !== 3) {
      throw new Error('No leading zeroes allowed')
    }
    return BigInt(s)
  }),

  encode: (n: bigint) => `0x${n.toString(16)}`,
}

export const EVMTransactionSubCall = z
  .object({
    to: z
      .union([z.string(), z.null()])
      .transform((to) => to ?? undefined)
      .optional(),
    value: z
      .union([z.string().transform(BigInt), z.null()])
      .transform((value) => value ?? undefined)
      .optional(),
    input: z
      .union([z.string(), z.null()])
      .transform((input) => input ?? undefined)
      .optional(),
    data: z
      .union([z.string(), z.null()])
      .transform((data) => data ?? undefined)
      .optional(),
  })
  .transform((call) => ({
    to: call.to,
    value: call.value,
    data: call.input ?? call.data,
  }))
export type EVMTransactionSubCall = z.infer<typeof EVMTransactionSubCall>

export type EVMTransaction = z.infer<typeof EVMTransaction>
export const EVMTransaction = z
  .object({
    hash: z.string(),
    value: z
      .union([z.string().transform(BigInt), z.null()])
      .transform((value) => value ?? undefined)
      .optional(),
    from: z.string(),
    /** Address of the receiver, null when it's a contract creation transaction. */
    to: z
      .union([z.string(), z.null()])
      .transform((to) => (to === null ? undefined : to))
      .optional(),
    input: z
      .union([z.string(), z.null()])
      .transform((input) => input ?? undefined)
      .optional(),
    type: Quantity.decode.transform((n) => String(n)).optional(),
    calls: z
      .union([z.array(EVMTransactionSubCall), z.null()])
      .transform((calls) => calls ?? undefined)
      .optional(),
    blobVersionedHashes: z.array(z.string()).optional(),
    blockNumber: z.union([
      Quantity.decode.transform((n) => Number(n)),
      z.null(),
    ]),
  })
  .transform((raw) => ({
    hash: raw.hash,
    value: raw.value,
    from: raw.from,
    to: raw.to,
    data: raw.input,
    type: raw.type,
    calls: raw.calls,
    blobVersionedHashes: raw.blobVersionedHashes,
    blockNumber: raw.blockNumber,
  }))

export const EVMTransactionResponse = z.object({
  result: EVMTransaction,
})

const EVMTransactionReceipt = z.object({
  logs: z.array(
    z.object({
      topics: z.array(z.string()),
      data: z.string(),
    }),
  ),
})

export const EVMTransactionReceiptResponse = z.object({
  result: EVMTransactionReceipt,
})

const _EVMBlock = {
  timestamp: Quantity.decode.transform((n) => Number(n)),
  hash: z.string(),
  logsBloom: z.string(),
  number: Quantity.decode.transform((n) => Number(n)),
  parentBeaconBlockRoot: z.string().optional(),
}
export type EVMBlock = z.infer<typeof EVMBlock>
export const EVMBlock = z.object(_EVMBlock)

export const EVMBlockResponse = z.object({
  result: EVMBlock,
})

export type EVMBlockWithTransactions = z.infer<typeof EVMBlockWithTransactions>
const EVMBlockWithTransactions = z.object({
  ..._EVMBlock,
  transactions: z.array(EVMTransaction),
})

export const EVMBlockWithTransactionsResponse = z.object({
  result: EVMBlockWithTransactions,
})

export const EVMBalanceResponse = z.object({
  result: Quantity.decode,
})

export const BlockNumberResponse = z.object({
  result: Quantity.decode.transform((n) => Number(n)),
})

export type EVMFeeHistory = z.infer<typeof EVMFeeHistory>
export const EVMFeeHistory = z.object({
  baseFeePerGas: z.array(Quantity.decode),
  gasUsedRatio: z.array(z.number()),
  baseFeePerBlobGas: z.array(Quantity.decode),
  blobGasUsedRatio: z.array(z.number()),
  oldestBlock: Quantity.decode.transform((n) => Number(n)),
})

export const EVMFeeHistoryResponse = z.object({
  result: EVMFeeHistory,
})

export const EVMCallResponse = z.object({
  result: z.string().check((s) => HEX_REGEX.test(s), 'Invalid hex string'),
})

export interface CallParameters {
  to: EthereumAddress
  input: Bytes
}

/**
 * Result of an on-chain call: it either executed and returned data, or
 * reverted. Transport and node errors are NOT represented here - they are
 * thrown, so callers can retry them instead of mistaking them for on-chain
 * outcomes.
 */
export type CallResult = { reverted: true } | { reverted: false; data: Bytes }

export type RPCError = z.infer<typeof RPCError>
export const RPCError = z.object({
  error: z.object({
    code: z.number(),
    message: z.string(),
  }),
})

export type EVMLog = z.infer<typeof EVMLog>
export const EVMLog = z.object({
  address: z.string(),
  topics: z.array(z.string()),
  blockNumber: Quantity.decode.transform((n) => Number(n)),
  blockHash: z.string(),
  transactionHash: z.string(),
  data: z.string(),
  logIndex: Quantity.decode.transform((n) => Number(n)),
  // non-standard optimisation, number in sonic
  // although this is included in reth, geth and Nethermind since late 2025
  // see: https://github.com/ethereum/execution-apis/issues/295
  blockTimestamp: z
    .union([Quantity.decode, z.number().transform(BigInt)])
    // Some logs return 0x0 as block timestamp, which is invalid
    .transform((n) => (n === 0n ? undefined : Number(n)))
    .optional(),
})

export type EVMLogsResponse = z.infer<typeof EVMLogsResponse>
export const EVMLogsResponse = z.object({
  result: z.array(EVMLog),
})
