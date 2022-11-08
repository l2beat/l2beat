import { UnixTime } from '@l2beat/types'
import { z } from 'zod'

import { numberAs } from '../../tools/types'

const MS_IN_SECOND = 1000

export type LoopringBlockResponse = z.infer<typeof LoopringBlockResponse>

export const LoopringBlockResponse = z.object({
  blockId: z.number(),
  createdAt: numberAs((n) => new UnixTime(Math.floor(n / MS_IN_SECOND))),
  transactions: z.array(z.unknown()).transform((arr) => arr.length),
})
