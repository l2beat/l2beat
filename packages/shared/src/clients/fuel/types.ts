import { z } from 'zod'

export type FuelLatestBlockNumberResponse = z.infer<
  typeof FuelLatestBlockNumberResponse
>
export const FuelLatestBlockNumberResponse = z.object({
  data: z.object({
    blocks: z.object({
      nodes: z.array(
        z.object({
          height: z.string(),
        }),
      ),
    }),
  }),
})

export type FuelBlockResponse = z.infer<typeof FuelBlockResponse>
export const FuelBlockResponse = z.object({
  data: z.object({
    block: z.object({
      id: z.string(),
      height: z.string(),
      header: z.object({
        time: z.string(),
      }),
      transactionIds: z.array(z.string()),
    }),
  }),
})

export type FuelError = z.infer<typeof FuelError>
export const FuelError = z.object({
  errors: z.array(
    z.object({
      message: z.string(),
    }),
  ),
})
