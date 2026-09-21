/**
 * `baseline.json`: every parameterless view/pure getter with its value or its
 * error, as V1's system handlers would produce them. 93% of V1 value fields
 * come from these getters, so they are computed deterministically and the
 * model only ever sees them as facts (`$baseline.<field>` references).
 *
 * Values are already V1-formatted (`toContractValue` → `prefixAddresses` →
 * `asStructured`), so `output` can merge them into an entry untouched.
 */
import { v } from '@l2beat/validate'
import { ContractValueSchema } from './ContractValue'

export const BaselineField = v.object({
  /** Human-readable function fragment the value was read with. */
  fragment: v.string(),
  value: ContractValueSchema.optional(),
  error: v.string().optional(),
})

export const Baseline = v.object({
  fields: v.record(v.string(), BaselineField),
})

export type Baseline = v.infer<typeof Baseline>
export type BaselineField = v.infer<typeof BaselineField>
