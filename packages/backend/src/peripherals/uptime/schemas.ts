import { UnixTime } from '@l2beat/types'
import { z } from 'zod'

import { numberAs, stringAs } from '../../tools/types'

export const rpcSchema = z.object({
  result: z.string(),
})

export const aztecBlocksSchema = z.object({
  data: z.object({
    blocks: z.array(
      z.object({
        created: stringAs((d) => UnixTime.fromDateString(d)),
      }),
    ),
  }),
})

export const dydxTradesSchema = z.object({
  trades: z.array(
    z.object({
      createdAt: stringAs((s) => UnixTime.fromDateString(s)),
    }),
  ),
})

export const loopringTradesSchema = z.object({
  trades: z.array(z.array(z.string())),
})

export const immutablexTradesSchema = z.object({
  result: z.array(
    z.object({ timestamp: stringAs((s) => UnixTime.fromDateString(s)) }),
  ),
})

export const starknetBlockSchema = z.object({
  timestamp: numberAs((n) => new UnixTime(n)),
})

export const zkspaceTradesSchema = z.object({
  data: z.object({
    data: z.array(z.object({ created_at: numberAs((n) => new UnixTime(n)) })),
  }),
})

export const zksyncBlockSchema = z.object({
  status: z.string(),
  result: z.object({
    list: z.array(
      z.object({ committedAt: stringAs((s) => UnixTime.fromDateString(s)) }),
    ),
  }),
})
