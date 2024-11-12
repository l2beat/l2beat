import { z } from 'zod'
import { nanoidSchema } from '~/lib/schemas'

export const insertTokenSchema = z.object({
  networkId: nanoidSchema,
  address: z.union([z.literal('native'), z.string().length(42)]),
  managingEntities: z.array(z.object({ entityId: nanoidSchema })),
  relations: z.array(
    z
      .object({
        externalBridgeId: nanoidSchema.nullable(),
      })
      .and(
        z.union([
          z.object({
            sourceTokenId: nanoidSchema,
          }),
          z.object({
            targetTokenId: nanoidSchema,
          }),
        ]),
      ),
  ),
  meta: z.array(
    z.object({
      externalId: z.string().nullable(),
      source: z.string(),
      name: z.string().nullable(),
      symbol: z.string().nullable(),
      decimals: z.number().int().nullable(),
      logoUrl: z.string().url().nullable(),
      contractName: z.string().nullable(),
    }),
  ),
})

export const tokenIdSchema = z.object({
  id: nanoidSchema,
})

export const updateTokenSchema = insertTokenSchema.extend(tokenIdSchema.shape)
