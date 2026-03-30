export interface InteropTransferValue {
  srcValueUsd?: number
  dstValueUsd?: number
}

export function getInteropTransferValue({
  srcValueUsd,
  dstValueUsd,
}: InteropTransferValue): number | undefined {
  if (srcValueUsd !== undefined && dstValueUsd !== undefined) {
    return Math.max(srcValueUsd, dstValueUsd)
  }

  return srcValueUsd ?? dstValueUsd
}
