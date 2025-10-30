import { v } from '@l2beat/validate'

export type CelestiaBlock = v.infer<typeof CelestiaBlock>
const CelestiaBlock = v.object({
  block: v.object({
    header: v.object({
      time: v.string(),
    }),
  }),
})

export const CelestiaBlockResponse = v.object({
  result: CelestiaBlock,
})

export type CelestiaBlockResult = v.infer<typeof CelestiaBlockResult>
const CelestiaBlockResult = v.object({
  height: v.string(),
  txs_results: v.union([
    v.null(),
    v.array(
      v.object({
        events: v.array(
          v.object({
            type: v.string(),
            attributes: v.array(
              v.object({ key: v.string(), value: v.string().optional() }),
            ),
          }),
        ),
      }),
    ),
  ]),
})

export const CelestiaValidatorsResponse = v.object({
  result: v.object({
    validators: v.array(
      v.object({
        voting_power: v.string().transform((x) => Number.parseInt(x)),
      }),
    ),
    count: v.string().transform((x) => Number.parseInt(x)),
    total: v.string().transform((x) => Number.parseInt(x)),
  }),
})

export const CelestiaBlockResultResponse = v.object({
  result: CelestiaBlockResult,
})

export const CelestiaErrorResponse = v.object({
  error: v.object({
    code: v.number(),
    message: v.string(),
    data: v.string(),
  }),
})
