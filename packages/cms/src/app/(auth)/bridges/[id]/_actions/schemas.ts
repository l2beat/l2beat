import { ExternalBridgeType } from '@l2beat/database/enums'
import { z } from 'zod'

export const insertBridgeSchema = z.object({
  name: z.string().min(3).max(191),
  type: z.nativeEnum(ExternalBridgeType).nullable(),
})

export const updateBridgeSchema = insertBridgeSchema.extend({
  id: z.string().length(21),
})
