import { v } from '@l2beat/validate'

export interface BlockscoutClientConfig {
  url: string
}

export const ContractCreationSchema = v.object({
  txHash: v.string(),
})

export const ContractCreationResultSchema = v.array(ContractCreationSchema)

export const TransactionInfoSchema = v.object({
  timeStamp: v.string().transform(Number),
})

export const BlockscoutResponseSchema = v.object({
  status: v.string(),
  message: v.string(),
  result: v.unknown(),
})
