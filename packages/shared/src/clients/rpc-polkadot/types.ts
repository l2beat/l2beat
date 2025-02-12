import { z } from 'zod'

export const PolkadotGetBlockHashResponse = z.object({
  result: z.string(),
})

export type PolkadotBlock = z.infer<typeof PolkadotBlock>
const PolkadotBlock = z.object({
  header: z.object({
    parentHash: z.string(),
    number: z.string(),
    stateRoot: z.string(),
    extrinsicsRoot: z.string(),
    extension: z.object({
      V3: z.object({
        appLookup: z.object({
          size: z.number(),
          index: z.array(
            z.object({
              appId: z.number(),
              start: z.number(),
            }),
          ),
        }),
        commitment: z.object({
          rows: z.number(),
          cols: z.number(),
          commitment: z.array(z.number()),
          dataRoot: z.string(),
        }),
      }),
    }),
  }),
  extrinsics: z.array(z.string()),
})

export const PolkadotGetBlockResponse = z.object({
  result: z.object({
    block: PolkadotBlock,
  }),
})

export const PolkadotErrorResponse = z.object({
  error: z.object({
    code: z.number(),
    message: z.string(),
    data: z.string(),
  }),
})
