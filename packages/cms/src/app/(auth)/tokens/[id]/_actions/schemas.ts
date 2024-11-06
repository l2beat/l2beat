import { z } from 'zod'
import { nanoidSchema } from '~/lib/schemas'

export const insertTokenSchema = z.object({
  networkId: nanoidSchema,
  address: z.union([z.string().length(42), z.literal('native')]),
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
  customMeta: z
    .object({
      name: z.string().nullable(),
      symbol: z.string().nullable(),
      decimals: z.number().int().nullable(),
      logoUrl: z.string().url().nullable(),
      contractName: z.string().nullable(),
    })
    .nullable(),
})

export const tokenIdSchema = z.object({
  id: nanoidSchema,
})

export const updateTokenSchema = insertTokenSchema.extend(tokenIdSchema.shape)
