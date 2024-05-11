import { isEmpty } from 'lodash'
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
  description: z.string().nullable().optional(),
  severity: z.enum(['HIGH', 'MEDIUM', 'LOW']).nullable().optional(),
  type: z
    .union([ValueType, z.array(ValueType)])
    .nullable()
    .optional(),
})

export function isEmptyValueMeta(value: ValueMeta): boolean {
  return (
    isEmpty(value) ||
    (value.description === null &&
      value.severity === null &&
      value.type === null)
  )
}

export type ContractMeta = z.infer<typeof ContractMeta>
export const ContractMeta = z.object({
  name: z.string(),
  extends: z.string().optional(),
  description: z.string().optional(),
  values: z.record(z.string(), ValueMeta).optional(),
})

export type DiscoveryMeta = z.infer<typeof DiscoveryMeta>
export const DiscoveryMeta = z.object({
  ['$schema']: z.string().optional(),
  contracts: z.array(ContractMeta),
})
