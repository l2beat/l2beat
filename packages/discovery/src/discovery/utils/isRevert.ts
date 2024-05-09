import { z } from 'zod'

export function isRevert(e: unknown): boolean {
  if (!(e instanceof Error)) {
    return false
  }
  if ('error' in e) {
    const parsed = ethersError.parse(e.error)
    if (parsed.reason === 'bad response' && parsed.status !== undefined) {
      return false
    }
  }
  return (
    e.message.includes('invalid opcode: INVALID') ||
    e.message.includes('CALL_EXCEPTION') ||
    e.message.includes('revert') ||
    e.message.includes('reverted')
  )
}

const ethersError = z.object({
  reason: z.string(),
  status: z.number().optional(),
})
