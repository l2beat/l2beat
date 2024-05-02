import { z } from 'zod'

export function parseEthersError(e: unknown): Error | undefined {
  const parsed = ethersError.safeParse(e)

  if (parsed.success) {
    return new Error(JSON.stringify(parsed.data))
  }

  return undefined
}

const ethersError = z.object({
  error: z.object({
    code: z.string().optional(),
    reason: z.string().optional(),
    requestMethod: z.string().optional(),
    timeout: z.number().optional(),
  }),
})
