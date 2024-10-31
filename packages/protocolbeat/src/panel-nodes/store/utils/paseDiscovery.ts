import { z } from 'zod'

export function parseDiscovery(data: unknown): DiscoveryOutput {
  return DiscoveryOutput.parse(data)
}

export function encodeProjectId(discovery: DiscoveryOutput) {
  return `${discovery.name}@${discovery.chain}`
}

export type DiscoveryContract = z.infer<typeof DiscoveryContract>
export const DiscoveryContract = z
  .object({
    name: z.string(),
    address: z.string(),
    proxyType: z.optional(z.string()),
    values: z.optional(z.record(z.unknown())),
  })
  .passthrough()

export type DiscoveryEoa = z.infer<typeof DiscoveryEoa>
export const DiscoveryEoa = z
  .object({
    address: z.string(),
    roles: z.optional(z.array(z.string())),
  })
  .passthrough()

export type DiscoveryOutput = z.infer<typeof DiscoveryOutput>
export const DiscoveryOutput = z
  .object({
    name: z.string(),
    chain: z.string(),
    contracts: z.array(DiscoveryContract),
    eoas: z.array(DiscoveryEoa),
  })
  .passthrough()
