import { z } from 'zod'

export function parseEthersError(e: unknown): Error | undefined {
  if (!(e instanceof Error)) {
    return undefined
  }

  if ('error' in e) {
    return new Error(JSON.stringify(ethersError.parse(e)))
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
