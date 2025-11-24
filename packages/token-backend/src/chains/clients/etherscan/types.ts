import { v } from '@l2beat/validate'

export interface EtherscanClientConfig {
  apiKey: string
  baseUrl?: string
}

export const ContractCreationSchema = v.object({
  timestamp: v.string().transform(Number),
})

export const ContractCreationResultSchema = v.array(ContractCreationSchema)

export const EtherscanResponseSchema = v.object({
  status: v.string(),
  message: v.string(),
  result: v.unknown(),
})
