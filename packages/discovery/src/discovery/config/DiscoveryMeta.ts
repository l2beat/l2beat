import { z } from 'zod'

export const ValueType = z.enum([
  'CODE_CHANGE',
  'L2',
  'EXTERNAL',
  'RISK_PARAMETER',
  'PERMISSION',
])

export type ValueMeta = z.infer<typeof ValueMeta>
export const ValueMeta = z.object({
  description: z.string().nullable(),
  severity: z.enum(['HIGH', 'MEDIUM', 'LOW']).nullable(),
  type: z.union([ValueType, z.array(ValueType)]).nullable(),
})

export type ContractMeta = z.infer<typeof ContractMeta>
export const ContractMeta = z.object({
  name: z.string(),
  description: z.string().optional(),
  values: z.record(z.string(), ValueMeta),
})

export type DiscoveryMeta = z.infer<typeof DiscoveryMeta>
export const DiscoveryMeta = z.object({
  ['$schema']: z.string().optional(),
  contracts: z.array(ContractMeta),
})
