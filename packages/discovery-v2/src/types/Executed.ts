/**
 * Runtime schema for `values.json`, the executor's output.
 *
 * `Executed` itself is defined next to the executor; this parser exists
 * because the CLI reads the file back for `output`, and a file crossing a
 * process boundary is checked, not trusted, like every other V2 file.
 */
import { type Parser, v } from '@l2beat/validate'
import type { Executed } from '../execute/executePlan'
import { ContractValueSchema } from './ContractValue'

export const ExecutedSchema: Parser<Executed> = v.object({
  fields: v.record(
    v.string(),
    v.object({
      value: ContractValueSchema.optional(),
      error: v.string().optional(),
    }),
  ),
  raw: v.record(v.string(), v.unknown()),
  status: v.enum(['ok', 'partial']),
})
