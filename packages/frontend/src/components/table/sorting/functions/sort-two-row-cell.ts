export function sortTwoRowCell<
  TData extends { value: string; secondLine?: string },
>(rowA: TData | undefined, rowB: TData | undefined) {
  if (!rowA && !rowB) {
    return 0
  }
  if (!rowA) {
    return -1
  }
  if (!rowB) {
    return 1
  }

  const firstLineResult = rowA.value.localeCompare(rowB.value)
  if (firstLineResult !== 0) {
    return firstLineResult
  }

  if (!rowA.secondLine && !rowB.secondLine) {
    return 0
  }
  if (!rowA.secondLine) {
    return -1
  }
  if (!rowB.secondLine) {
    return 1
  }

  return rowB.secondLine.localeCompare(rowA.secondLine)
}
