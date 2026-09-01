export function partition<T>(
  array: T[],
  predicate: (item: T) => boolean,
): [T[], T[]] {
  const pass: T[] = []
  const fail: T[] = []

  for (const item of array) {
    if (predicate(item)) pass.push(item)
    else fail.push(item)
  }

  return [pass, fail]
}
