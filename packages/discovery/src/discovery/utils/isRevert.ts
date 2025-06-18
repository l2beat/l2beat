import { v } from '@l2beat/validate'

export function isRevert(e: unknown): boolean {
  if (!(e instanceof Error)) {
    return false
  }
  if ('error' in e) {
    const parsed = ethersError.validate(e.error)
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

const ethersError = v.object({
  reason: v.string(),
  status: v.number().optional(),
})
