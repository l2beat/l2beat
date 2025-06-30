import { v } from '@l2beat/validate'

export type DiscoveryContract = v.infer<typeof DiscoveryContract>
export const DiscoveryContract = v.object({
  type: v.literal('Contract'),
  name: v.string(),
  address: v.string(),
  proxyType: v.string().optional(),
  values: v.record(v.string(), v.unknown()).optional(),
})

export type DiscoveryEoa = v.infer<typeof DiscoveryEoa>
export const DiscoveryEoa = v.object({
  type: v.literal('EOA'),
  address: v.string(),
  roles: v.array(v.string()).optional(),
})

export type DiscoveryOutput = v.infer<typeof DiscoveryOutput>
export const DiscoveryOutput = v.object({
  name: v.string(),
  chain: v.string(),
  entries: v.array(v.union([DiscoveryContract, DiscoveryEoa])),
})
