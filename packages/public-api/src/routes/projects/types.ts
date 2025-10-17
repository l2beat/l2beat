import { v } from '@l2beat/validate'

export const ProjectSchema = v
  .object({
    id: v.string(),
    slug: v.string(),
    name: v.string(),
    chainId: v.number().optional(),
  })
  .describe('Project')

export const DetailedProjectSchema = v
  .object({
    id: v.string(),
    slug: v.string(),
    name: v.string(),
    chainId: v.number().optional(),
    type: v.string().optional(),
    isUpcoming: v.boolean().optional(),
    isArchived: v.boolean().optional(),
    category: v.string().optional(),
    hostChain: v.string().optional(),
    stacks: v.array(v.string()),
    ecosystem: v.string().optional(),
    gasTokens: v.array(v.string()),
    stage: v.string().optional(),
    purposes: v.array(v.string()),
    badges: v.array(v.string()),
  })
  .describe('DetailedProject')

export const ContractSchema = v
  .object({
    name: v.string(),
    contractAddress: v.string(),
    chain: v.string(),
  })
  .describe('Contract')
