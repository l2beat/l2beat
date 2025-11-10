import { v } from '@l2beat/validate'

export interface BlockscoutClientConfig {
  url: string
}

export const ContractCreationSchema = v.object({
  timestamp: v.string().transform(Number),
})

export const ContractCreationResultSchema = v.array(ContractCreationSchema)

export const BlockscoutResponseSchema = v.object({
  status: v.string(),
  message: v.string(),
  result: v.unknown(),
})
