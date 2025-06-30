import { v } from '@l2beat/validate'

export type FuelLatestBlockNumberResponse = v.infer<
  typeof FuelLatestBlockNumberResponse
>
export const FuelLatestBlockNumberResponse = v.object({
  data: v.object({
    blocks: v.object({
      nodes: v.array(
        v.object({
          height: v.string(),
        }),
      ),
    }),
  }),
})

export type FuelBlockResponse = v.infer<typeof FuelBlockResponse>
export const FuelBlockResponse = v.object({
  data: v.object({
    block: v.object({
      id: v.string(),
      height: v.string(),
      header: v.object({
        time: v.string(),
      }),
      transactionIds: v.array(v.string()),
    }),
  }),
})

export type FuelError = v.infer<typeof FuelError>
export const FuelError = v.object({
  errors: v.array(
    v.object({
      message: v.string(),
    }),
  ),
})
