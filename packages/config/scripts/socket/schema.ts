import { z } from 'zod'

export const SocketVaults = z.object({
  vaults: z.array(z.string()),
  plugs: z.array(z.string()),
  vaultsData: z.array(
    z.object({
      address: z.string(),
      tvl: z.string(),
      ethValue: z.string(),
      token: z.string().optional(),
    }),
  ),
})
export type SocketVaults = z.infer<typeof SocketVaults>
