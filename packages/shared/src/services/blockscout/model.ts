import { z } from 'zod'

export type BlockscoutSuccessResponse = z.infer<
  typeof BlockscoutSuccessResponse
>
const BlockscoutSuccessResponse = z.object({
  message: z.literal('OK'),
  result: z.unknown(),
})

export type BlockscoutErrorResponse = z.infer<typeof BlockscoutErrorResponse>
const BlockscoutErrorResponse = z.object({
  message: z.literal('NOTOK'),
  result: z.string(),
})

export type BlockscoutResponse = z.infer<typeof BlockscoutResponse>
const BlockscoutResponse = z.union([
  BlockscoutSuccessResponse,
  BlockscoutErrorResponse,
])

export function parseBlockscoutResponse(value: string): BlockscoutResponse {
  try {
    const json: unknown = JSON.parse(value)
    return BlockscoutResponse.parse(json)
  } catch {
    throw new TypeError('Invalid Blockscout response')
  }
}

export const BlockscoutGetBlockNoByTime = z.object({
  blockNumber: z.coerce.number(),
})
