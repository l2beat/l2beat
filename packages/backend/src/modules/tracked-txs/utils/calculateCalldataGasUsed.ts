const PECTRA_START_BLOCK = 22431084

export function calculateCalldataGasUsed(
  blockNumber: number,
  dataLength: number,
  nonZeroBytes: number,
  gasUsed: number,
) {
  const zeroBytes = dataLength - nonZeroBytes
  const standardCalldata = 16 * nonZeroBytes + 4 * zeroBytes

  if (blockNumber < PECTRA_START_BLOCK) {
    return standardCalldata
  }

  const compute = gasUsed - standardCalldata - 21_000

  if (compute >= 1.5 * standardCalldata) {
    return standardCalldata
  }

  return 40 * nonZeroBytes + 10 * zeroBytes
}
