import z from 'zod'

import { branded } from '../branded'
import { EthereumAddress } from '../EthereumAddress'
import { UnixTime } from '../UnixTime'

export const DiscoveryHistory = z.object({
  project: z.string(),
  discoveries: z.array(
    z.object({
      blockNumber: z.number(),
      timestamp: branded(z.number(), (n) => new UnixTime(n)),
      discovery: z.string(),
    }),
  ),
})

export type DiscoveryHistory = z.infer<typeof DiscoveryHistory>

export const DiscoveryDiff = z.object({
  name: z.string(),
  address: branded(z.string(), EthereumAddress),
  diff: z.optional(
    z.array(
      z.object({
        key: z.optional(z.string()),
        before: z.optional(z.string()),
        after: z.optional(z.string()),
      }),
    ),
  ),
  type: z.optional(z.enum(['created', 'deleted'])),
})

export type DiscoveryDiff = z.infer<typeof DiscoveryDiff>

export const DiffHistoryApiResponse = z.array(
  z.object({
    project: z.string(),
    changes: z.array(
      z.object({
        timestamp: z.string(),
        diffs: z.array(DiscoveryDiff),
      }),
    ),
  }),
)

export type DiffHistoryApiResponse = z.infer<typeof DiffHistoryApiResponse>
