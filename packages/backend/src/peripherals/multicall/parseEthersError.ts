import { v } from '@l2beat/validate'

export function parseEthersError(e: unknown): Error | undefined {
  const parsed = ethersError.safeParse(e)

  if (parsed.success) {
    return new Error(JSON.stringify(parsed.data))
  }

  return undefined
}

const ethersError = v.object({
  error: v.object({
    code: v.string().optional(),
    reason: v.string().optional(),
    requestMethod: v.string().optional(),
    timeout: v.number().optional(),
  }),
})
