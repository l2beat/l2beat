import { v } from '@l2beat/validate'

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

export const CelestiaBlockchainResponse = v.object({
  result: v.object({
    last_height: v.string(),
  }),
})

export const CelestiaErrorResponse = v.object({
  error: v.object({
    code: v.number(),
    message: v.string(),
    data: v.string(),
  }),
})

export type CelestiaBlobResponse = v.infer<typeof CelestiaBlobSchema>
const CelestiaBlobSchema = v.object({
  namespace: v.string(),
  data: v.string(),
})
export const CelestiaBlobsResponse = v.object({
  result: v.union([v.array(CelestiaBlobSchema), v.null()]),
})
