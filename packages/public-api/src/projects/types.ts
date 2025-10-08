import { v } from '@l2beat/validate'

export const ProjectSchema = v
  .object({
    id: v.string(),
    slug: v.string(),
    name: v.string(),
    chainId: v.number().optional(),
  })
  .describe('Project')

export const ContractSchema = v
  .object({
    name: v.string(),
    contractAddress: v.string(),
    chain: v.string(),
  })
  .describe('Contract')
