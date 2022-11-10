import { branded, EthereumAddress } from '@l2beat/types'
import * as z from 'zod'

export type DiscoveryContract = z.infer<typeof DiscoveryContract>
export const DiscoveryContract = z.object({
  ignoreDiscovery: z.optional(z.boolean()),
  // TODO: enum?
  proxyType: z.optional(z.string()),
  ignoreInWatchMode: z.optional(z.array(z.string())),
  ignoreMethods: z.optional(z.array(z.string())),
  fields: z.optional(
    z.record(
      // TODO: union?
      z.object({
        type: z.string(),
      }),
    ),
  ),
})

export type DiscoveryConfig = z.infer<typeof DiscoveryConfig>
export const DiscoveryConfig = z.object({
  name: z.string().min(1),
  initialAddresses: z.array(branded(z.string(), EthereumAddress)),
  overrides: z.optional(
    // TODO: for some reason branded doesn't work as a key with type inference
    z.record(z.string(), DiscoveryContract),
  ),
})
