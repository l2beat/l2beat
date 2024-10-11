import { z } from 'zod'

export const insertTokenSchema = z.object({
  networkId: z.string().length(21),
  address: z.string().length(42),
  relations: z.array(
    z.object({
      sourceTokenId: z.string().length(21),
      targetTokenId: z.string().length(21),
      externalBridgeId: z.string().length(21).nullable(),
    }),
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
  id: z.string().length(21),
})

export const updateTokenSchema = insertTokenSchema.extend(tokenIdSchema.shape)
