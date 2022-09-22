import { z } from 'zod'

export type StarkexApiSuccessResponse = z.infer<
  typeof StarkexApiSuccessResponse
>
const StarkexApiSuccessResponse = z.object({
  count: z.number(),
})

//TODO: Add error response

export function parseStarkexApiResponse(
  value: string,
): StarkexApiSuccessResponse {
  try {
    const json: unknown = JSON.parse(value)
    return StarkexApiSuccessResponse.parse(json)
  } catch {
    throw new TypeError('Invalid Starkex response.')
  }
}
