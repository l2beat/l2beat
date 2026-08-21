/**
 * JSON-RPC has no standardized error code for reverts (geth uses 3, other
 * nodes use -32000/-32015 with assorted messages), so revert detection is
 * message-based. Transport and node errors (timeouts, rate limits, pruned
 * state) must never match - callers rely on those propagating as errors.
 */
export function isRevertErrorMessage(message: string): boolean {
  return (
    message.includes('invalid opcode: INVALID') ||
    message.includes('CALL_EXCEPTION') ||
    message.includes('revert') ||
    message.includes('gas required exceeds allowance')
  )
}
