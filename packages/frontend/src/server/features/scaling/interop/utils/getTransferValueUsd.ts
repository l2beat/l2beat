type ValueRecord = {
  srcValueUsd: number | undefined
  dstValueUsd: number | undefined
}

export function getTransferValueUsd(record: ValueRecord): number | undefined {
  if (record.srcValueUsd === undefined) return record.dstValueUsd
  if (record.dstValueUsd === undefined) return record.srcValueUsd
  return Math.max(record.srcValueUsd, record.dstValueUsd)
}
