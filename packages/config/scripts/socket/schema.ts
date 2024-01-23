import { z } from 'zod'

export const SocketVaults = z.object({
  vaults: z.array(z.string()),
  plugs: z.array(z.string()),
})
export type SocketVaults = z.infer<typeof SocketVaults>
