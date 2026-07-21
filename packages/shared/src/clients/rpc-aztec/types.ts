import { v as z } from '@l2beat/validate'

const AztecBlock = z
  .object({
    number: z.number().check(Number.isInteger),
    header: z.object({
      globalVariables: z.object({
        timestamp: z.string().transform(Number).check(Number.isInteger),
      }),
    }),
    body: z.object({
      txEffects: z.array(z.unknown()),
    }),
  })
  .transform((block) => ({
    number: block.number,
    timestamp: block.header.globalVariables.timestamp,
    txEffectsCount: block.body.txEffects.length,
  }))

export const AztecGetBlockNumberResponse = z.object({
  result: z.number().check(Number.isInteger),
})

export const AztecGetBlocksResponse = z.object({
  result: z.array(AztecBlock),
})

export const AztecRpcErrorResponse = z.object({
  error: z.object({
    code: z.number(),
    message: z.string(),
  }),
})
