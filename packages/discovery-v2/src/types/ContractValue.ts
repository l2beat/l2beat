/**
 * Runtime schemas for the two value types every V2 file shares.
 *
 * `ContractValue` is V1's output value type, re-exported so V2 code never
 * defines a second notion of "what a value looks like". The schema exists
 * because `prepared.json`, `baseline.json` and `values.json` cross a CLI
 * boundary as JSON and must be checked on the way in, not trusted.
 */
import type { ContractValue } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { type Parser, v } from '@l2beat/validate'

export type { ContractValue }

export const ContractValueSchema: Parser<ContractValue> = v.lazy(() =>
  v.union([
    v.string(),
    v.number(),
    v.boolean(),
    v.array(ContractValueSchema),
    v.record(v.string(), ContractValueSchema.optional()),
  ]),
)

/** A `short:0x…` address, checksummed on parse so equality is string equality. */
export const ChainSpecificAddressSchema: Parser<ChainSpecificAddress> = v
  .string()
  .transform((value) => ChainSpecificAddress(value))
