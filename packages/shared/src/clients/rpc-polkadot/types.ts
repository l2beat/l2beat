import { v } from '@l2beat/validate'

export const PolkadotGetBlockHashResponse = v.object({
  result: v.string(),
})

export type PolkadotBlock = v.infer<typeof PolkadotBlock>
const PolkadotBlock = v.object({
  header: v.object({
    parentHash: v.string(),
    number: v.string(),
    stateRoot: v.string(),
    extrinsicsRoot: v.string(),
    extension: v.object({
      V3: v.object({
        appLookup: v.object({
          size: v.number(),
          index: v.array(
            v.object({
              appId: v.number(),
              start: v.number(),
            }),
          ),
        }),
        commitment: v.object({
          rows: v.number(),
          cols: v.number(),
          commitment: v.array(v.number()),
          dataRoot: v.string(),
        }),
      }),
    }),
  }),
  extrinsics: v.array(v.string()),
})

export const PolkadotGetBlockResponse = v.object({
  result: v.object({
    block: PolkadotBlock,
  }),
})

export const PolkadotErrorResponse = v.object({
  error: v.object({
    code: v.number(),
    message: v.string(),
    data: v.string(),
  }),
})
