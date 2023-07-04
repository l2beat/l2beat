import { stringAs, UnixTime } from '@l2beat/shared-pure'
import { z } from 'zod'

export type Rollup = z.infer<typeof Rollup>
const mined = stringAs((s) => UnixTime.fromDate(new Date(s)))
export const Rollup = z.object({
  id: z.number().int(),
  mined,
  numTxs: z.number().int(),
})

export type Rollups = z.infer<typeof Rollups>
export const Rollups = z.array(
  Rollup.extend({ mined: mined.nullable().optional() }),
)

export type AztecGetRollupsResponseBody = z.infer<
  typeof AztecGetRollupsResponseBody
>
export const AztecGetRollupsResponseBody = z.object({
  data: z.object({
    rollups: Rollups,
  }),
})

export type AztecGetRollupResponseBody = z.infer<
  typeof AztecGetRollupResponseBody
>
export const AztecGetRollupResponseBody = z.object({
  data: z.object({
    rollup: Rollup,
  }),
})

export function parseWithSchema<T extends z.ZodType<unknown>>(
  data: unknown,
  schema: T,
): z.TypeOf<T> {
  const result = schema.safeParse(data)
  if (!result.success) {
    throw new Error(
      `ZodError: ${JSON.stringify(result.error.issues)}, Data: ${JSON.stringify(
        data,
      )}`,
    )
  }
  return result.data
}

export interface Block {
  number: number
  timestamp: UnixTime
  transactionCount: number
}

export function toBlock(rollup: Rollup): Block {
  return {
    number: rollup.id,
    timestamp: rollup.mined,
    transactionCount: rollup.numTxs,
  }
}
