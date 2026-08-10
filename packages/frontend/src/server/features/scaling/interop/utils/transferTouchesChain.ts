export function transferTouchesChain(
  transfer: { srcChain: string; dstChain: string },
  anchorChain: string | undefined,
): boolean {
  return (
    anchorChain === undefined ||
    transfer.srcChain === anchorChain ||
    transfer.dstChain === anchorChain
  )
}
