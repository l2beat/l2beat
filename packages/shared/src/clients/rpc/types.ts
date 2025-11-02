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

export type EVMTransaction = z.infer<typeof EVMTransaction>
export const EVMTransaction = z
  .object({
    hash: z.string(),
    value: z.string().transform(BigInt),
    from: z.string(),
    /** Address of the receiver, null when it's a contract creation transaction. */
    to: z
      .union([z.string(), z.null()])
      .transform((to) => (to === null ? undefined : to))
      .optional(),
    input: z.string(),
    type: Quantity.decode.transform((n) => String(n)).optional(),
    blobVersionedHashes: z.array(z.string()).optional(),
    blockNumber: z.union([
      Quantity.decode.transform((n) => Number(n)),
      z.null(),
    ]),
  })
  .transform((tx) => ({
    hash: tx.hash,
    value: tx.value,
    from: tx.from,
    to: tx.to,
    data: tx.input,
    type: tx.type,
    blobVersionedHashes: tx.blobVersionedHashes,
    blockNumber: tx.blockNumber,
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
const EVMBlock = z.object(_EVMBlock)

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

export const EVMCallResponse = z.object({
  result: z.string().check((s) => HEX_REGEX.test(s), 'Invalid hex string'),
})

export interface CallParameters {
  to: EthereumAddress
  data: Bytes
}

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
})

export type EVMLogsResponse = z.infer<typeof EVMLogsResponse>
export const EVMLogsResponse = z.object({
  result: z.array(EVMLog),
})
