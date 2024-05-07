import z from 'zod'

import { EthereumAddress } from '../EthereumAddress'
import { branded } from '../branded'

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
