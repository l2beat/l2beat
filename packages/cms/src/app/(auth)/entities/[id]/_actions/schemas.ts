import { z } from 'zod'
import { nanoidSchema } from '~/lib/schemas'

export const insertEntitySchema = z.object({
  name: z.string().min(3).max(191),
})

export const entityIdSchema = z.object({
  id: nanoidSchema,
})

export const updateEntitySchema = insertEntitySchema.extend(
  entityIdSchema.shape,
)
