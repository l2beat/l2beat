import {
  ExplorerType,
  NetworkType,
} from '@l2beat/database/dist/kysely/generated/enums'
import { z } from 'zod'

export const insertNetworkSchema = z.object({
  name: z.string().min(3).max(191),
  logoUrl: z.string().url().nullable(),
  type: z.nativeEnum(NetworkType).nullable(),
  chainId: z.number().int().positive(),
  coingeckoId: z.string().nullable(),
  axelarId: z.string().nullable(),
  axelarGatewayAddress: z.string().nullable(),
  orbitId: z.string().nullable(),
  wormholeId: z.string().nullable(),
  layerZeroV1EndpointAddress: z.string().nullable(),
  rpcs: z.array(z.object({ url: z.string() })),
  explorers: z.array(
    z.object({
      type: z.nativeEnum(ExplorerType),
      url: z.string(),
      apiKey: z.string(),
    }),
  ),
})

export const networkIdSchema = z.object({
  id: z.string().length(21),
})

export const updateNetworkSchema = insertNetworkSchema.extend(
  networkIdSchema.shape,
)
