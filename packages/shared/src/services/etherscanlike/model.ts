import { z } from 'zod'

export type EtherscanSuccessResponse = z.infer<typeof EtherscanSuccessResponse>
const EtherscanSuccessResponse = z.object({
  message: z.literal('OK'),
  result: z.unknown(),
})

export type EtherscanErrorResponse = z.infer<typeof EtherscanErrorResponse>
const EtherscanErrorResponse = z.object({
  message: z.literal('NOTOK'),
  result: z.string(),
})

export type EtherscanResponse = z.infer<typeof EtherscanResponse>
const EtherscanResponse = z.union([
  EtherscanSuccessResponse,
  EtherscanErrorResponse,
])

export function parseEtherscanResponse(value: string): EtherscanResponse {
  try {
    const json: unknown = JSON.parse(value)
    return EtherscanResponse.parse(json)
  } catch {
    throw new TypeError('Invalid Etherscan response')
  }
}
