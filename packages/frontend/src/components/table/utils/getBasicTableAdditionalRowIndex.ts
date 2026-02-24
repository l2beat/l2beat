export function getBasicTableAdditionalRowIndex(
  additionalRowIndex: number,
  rowSpan: number,
): number | undefined {
  const actualIndex = (additionalRowIndex + 1) / rowSpan - 1
  if (!Number.isInteger(actualIndex)) {
    return undefined
  }
  return actualIndex
}
