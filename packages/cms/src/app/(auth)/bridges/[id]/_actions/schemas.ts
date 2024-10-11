import { ExternalBridgeType } from '@l2beat/database/enums'
import { z } from 'zod'

export const insertBridgeSchema = z.object({
  name: z.string().min(3).max(191),
  type: z.nativeEnum(ExternalBridgeType).nullable(),
})

export const bridgeIdSchema = z.object({
  id: z.string().length(21),
})

export const updateBridgeSchema = insertBridgeSchema.extend(
  bridgeIdSchema.shape,
)
