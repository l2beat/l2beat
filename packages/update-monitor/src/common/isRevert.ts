export function isRevert(e: unknown) {
  if (!(e instanceof Error)) {
    return false
  }
  return (
    e.message.includes('invalid opcode: INVALID') ||
    e.message.includes('reverted')
  )
}
