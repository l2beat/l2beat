import { type Validator, v } from '@l2beat/validate'
import type { Chain } from './chains'

const BlockNumber = v
  .number()
  .check((n) => Number.isInteger(n) && n >= 0, 'Expected a block number')

const BlockCount = v
  .number()
  .check((n) => Number.isInteger(n) && n > 0, 'Expected a positive integer')

export type UserOperationsApiRequest = v.infer<typeof UserOperationsApiRequest>
export const UserOperationsApiRequest = v.object({
  chainId: v.string(),
  blockNumber: BlockNumber,
})

export type LatestBlockApiRequest = v.infer<typeof LatestBlockApiRequest>
export const LatestBlockApiRequest = v.object({
  chainId: v.string(),
})

export type StatsApiRequest = v.infer<typeof StatsApiRequest>
export const StatsApiRequest = v.object({
  chainId: v.string(),
  count: BlockCount,
  lastFetched: BlockNumber.optional(),
})

export type LatestBlockApiResponse = v.infer<typeof LatestBlockApiResponse>
export const LatestBlockApiResponse = v.number()

export type ApiError = v.infer<typeof ApiError>
export const ApiError = v.object({
  message: v.string(),
  code: v.number().optional(),
})

export interface CountedOperation {
  id: string
  level: number
  methodSelector: string
  methodSignature?: string
  methodName?: string
  contractAddress?: string
  contractName?: string
  count: number
  children: CountedOperation[]
}
export const CountedOperation: Validator<CountedOperation> = v.lazy(() =>
  v.object({
    id: v.string(),
    level: v.number(),
    methodSelector: v.string(),
    methodSignature: v.string().optional(),
    methodName: v.string().optional(),
    contractAddress: v.string().optional(),
    contractName: v.string().optional(),
    count: v.number(),
    children: v.array(CountedOperation),
  }),
)

export type CountedTransaction = v.infer<typeof CountedTransaction>
export const CountedTransaction = v.object({
  from: v.string(),
  type: v.string(),
  hash: v.string(),
  operationsCount: v.number(),
  details: CountedOperation.optional(),
  includesBatch: v.boolean().optional(),
  includesUnknown: v.boolean().optional(),
})

export type CountedBlock = v.infer<typeof CountedBlock>
export const CountedBlock = v.object({
  number: v.number(),
  timestamp: v.number(),
  hash: v.string(),
  status: v.string().optional(),
  transactions: v.array(CountedTransaction),
})

export type BlockRatio = v.infer<typeof BlockRatio>
export const BlockRatio = v.object({
  number: v.number(),
  ratio: v.number(),
  includesBatch: v.boolean().optional(),
  includesUnknown: v.boolean().optional(),
})

// JSON has no Date, so the server's Dates arrive as ISO strings.
const DateFromJson = v
  .string()
  .transform((value) => new Date(value))
  .check((date) => !Number.isNaN(date.getTime()), 'Expected a date')

export type Stats = v.infer<typeof Stats>
export const Stats = v.object({
  startBlock: v.number(),
  endBlock: v.number(),
  numberOfBlocks: v.number(),
  dateStart: DateFromJson,
  dateEnd: DateFromJson,
  numberOfTransactions: v.number(),
  numberOfOperations: v.number(),
  topBlocks: v.array(BlockRatio),
  smartAccountUsage: v
    .array(v.object({ signature: v.string(), count: v.number() }))
    .optional(),
})

export type StatParams = Pick<
  Stats,
  'startBlock' | 'endBlock' | 'numberOfBlocks'
>

export type StatResults = Omit<Stats, keyof StatParams>

export type BlockWithChain = CountedBlock & { chain: Chain }

export type StatsWithChain = Stats & { chain: Chain }
