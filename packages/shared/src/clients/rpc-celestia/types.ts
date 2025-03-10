import { z } from 'zod'

export type CelestiaBlock = z.infer<typeof CelestiaBlock>
const CelestiaBlock = z.object({
  block: z.object({
    header: z.object({
      time: z.string(),
    }),
  }),
})

export const CelestiaBlockResponse = z.object({
  result: CelestiaBlock,
})

export type CelestiaBlockResult = z.infer<typeof CelestiaBlockResult>
const CelestiaBlockResult = z.object({
  height: z.string(),
  txs_results: z
    .array(
      z.object({
        log: z.preprocess(
          (val) => {
            try {
              return JSON.parse(String(val))
            } catch {
              return []
            }
          },
          z.array(
            z.object({
              events: z.array(
                z.object({
                  type: z.string(),
                  attributes: z.array(
                    z.object({
                      key: z.string(),
                      value: z.string().optional(),
                    }),
                  ),
                }),
              ),
            }),
          ),
        ),
      }),
    )
    .or(z.null()),
})

export const CelestiaBlockResultResponse = z.object({
  result: CelestiaBlockResult,
})

export const CelestiaErrorResponse = z.object({
  error: z.object({
    code: z.number(),
    message: z.string(),
    data: z.string(),
  }),
})
