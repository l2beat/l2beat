import { z } from 'zod'

export const insertNetworkSchema = z.object({
  name: z.string().min(3).max(191),
  logoUrl: z.string().url().nullable(),
  chainId: z.number().int().positive(),
  coingeckoId: z.string().nullable(),
  axelarId: z.string().nullable(),
  axelarGatewayAddress: z.string().nullable(),
  orbitId: z.string().nullable(),
  wormholeId: z.string().nullable(),
  layerZeroV1EndpointAddress: z.string().nullable(),
})

export const networkIdSchema = z.object({
  id: z.string().length(21),
})

export const updateNetworkSchema = insertNetworkSchema.extend(
  networkIdSchema.shape,
)
