import { z } from 'zod'

export type RoutescanSuccessResponse = z.infer<typeof RoutescanSuccessResponse>
const RoutescanSuccessResponse = z.object({
  message: z.literal('OK'),
  result: z.unknown(),
})

export type RoutescanErrorResponse = z.infer<typeof RoutescanErrorResponse>
const RoutescanErrorResponse = z.object({
  message: z.literal('NOTOK'),
  result: z.string(),
})

export type RoutescanResponse = z.infer<typeof RoutescanResponse>
const RoutescanResponse = z.union([
  RoutescanSuccessResponse,
  RoutescanErrorResponse,
])

export function parseRoutescanResponse(value: string): RoutescanResponse {
  try {
    const json: unknown = JSON.parse(value)
    return RoutescanResponse.parse(json)
  } catch {
    throw new TypeError('Invalid Routescan response')
  }
}

export const RoutescanGetBlockNoByTime = z.object({
  blockNumber: z.coerce.number(),
})
