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

const CelestiaLogs = v.array(
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
)

export type CelestiaBlockResult = v.infer<typeof CelestiaBlockResult>
const CelestiaBlockResult = v.object({
  height: v.string(),
  txs_results: v.union([
    v.null(),
    v.array(
      v.object({
        log: v.unknown().transform((val) => {
          let array = []
          try {
            array = JSON.parse(String(val))
          } catch {}

          return CelestiaLogs.parse(array)
        }),
      }),
    ),
  ]),
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
