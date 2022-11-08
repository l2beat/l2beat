import { UnixTime } from '@l2beat/types'
import { z } from 'zod'

import { stringAs } from '../../tools/types'

export type Rollup = z.infer<typeof Rollup>
const Rollup = z.object({
  id: z.number().int(),
  mined: stringAs((s) => UnixTime.fromDate(new Date(s))),
  numTxs: z.number().int(),
})

export type GetRollupsResponseBodySchema = z.infer<
  typeof GetRollupsResponseBodySchema
>
export const GetRollupsResponseBodySchema = z.object({
  data: z.object({
    rollups: z.array(Rollup),
  }),
})

export type GetRollupResponseBodySchema = z.infer<
  typeof GetRollupResponseBodySchema
>
export const GetRollupResponseBodySchema = z.object({
  data: z.object({
    rollup: Rollup,
  }),
})
