export function slidingWindow<T>(
  array: T[],
  size: number,
  advance: number,
): T[][] {
  if (
    !Number.isSafeInteger(size) ||
    size <= 0 ||
    !Number.isSafeInteger(advance) ||
    advance <= 0
  ) {
    throw new Error('size and advance must be positive safe integers')
  }

  const result: T[][] = []
  let index: number | null = 0

  while (index !== null) {
    const start: number | null = index
    const end = Math.min(start + size, array.length)
    result.push(array.slice(start, end))

    if (end === array.length) {
      index = null
    } else {
      index = start + advance
    }
  }

  return result
}
