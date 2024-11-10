import { ExternalBridgeType } from '@l2beat/database/dist/kysely/generated/enums'
import { z } from 'zod'
import { nanoidSchema } from '~/lib/schemas'

export const insertBridgeSchema = z.object({
  name: z.string().min(3).max(191),
  managingEntities: z.array(z.object({ entityId: nanoidSchema })),
  type: z.nativeEnum(ExternalBridgeType).nullable(),
})

export const bridgeIdSchema = z.object({
  id: nanoidSchema,
})

export const updateBridgeSchema = insertBridgeSchema.extend(
  bridgeIdSchema.shape,
)
